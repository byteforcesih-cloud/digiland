import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, GovernmentOfficer, PasswordResetToken
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import get_password_hash, verify_password, create_access_token, hash_aadhaar, mask_aadhaar
from app.core.audit import log_audit_event
from app.services.notification_service import NotificationService
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserRegister, 
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Register a new Citizen (or Officer with appropriate credentials).
    Validates:
    - Age >= 18
    - Matching passwords
    - Aadhaar 12 digits
    - Phone 10 digits
    - Dispatches welcome notification & mock SMS/Email
    """
    # 1. Check if email exists
    existing_user_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    # 2. Check if phone exists
    existing_user_phone = db.query(User).filter(User.phone == user_in.phone).first()
    if existing_user_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number already exists"
        )

    # 3. Optional Aadhaar hashing and masking
    aadhaar_h = hash_aadhaar(user_in.aadhaar_number) if user_in.aadhaar_number else None
    masked_aadh = mask_aadhaar(user_in.aadhaar_number) if user_in.aadhaar_number else None
    if aadhaar_h:
        existing_aadhaar = db.query(User).filter(User.aadhaar_hash == aadhaar_h).first()
        if existing_aadhaar:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this Aadhaar number already exists"
            )

    # 4. Hash password
    hashed_pwd = get_password_hash(user_in.password)
    role = user_in.role.upper() if user_in.role else "CITIZEN"
    if role not in ("CITIZEN", "GOVERNMENT_OFFICER"):
        role = "CITIZEN"

    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        phone=user_in.phone,
        age=user_in.age,
        aadhaar_hash=aadhaar_h,
        aadhaar_masked=masked_aadh,
        hashed_password=hashed_pwd,
        role=role,
        is_active=True,
        is_verified=True,
        verification_status="VERIFIED",
        preferred_language=user_in.preferred_language or "en"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 5. If registering as officer, create baseline profile
    if role == "GOVERNMENT_OFFICER":
        officer = GovernmentOfficer(
            user_id=new_user.id,
            officer_code=f"REV-TN-{uuid.uuid4().hex[:6].upper()}",
            badge_number=f"OFF-TN-{uuid.uuid4().hex[:4].upper()}",
            designation="Village Administrative Officer (VAO)",
            department="Revenue & Land Administration",
            state="Tamil Nadu",
            district="Chennai",
            taluk="Mylapore",
            is_authorized=True
        )
        db.add(officer)
        db.commit()
        db.refresh(new_user)

    # 6. Dispatch Welcome In-App Notification and Mock Email/SMS
    NotificationService.send_notification(
        db=db,
        user_id=new_user.id,
        title="Welcome to DigiLand Portal",
        message=f"Welcome {new_user.full_name}! Your digital land record management account is active. You can now upload, search, and verify land deeds.",
        notification_type="SYSTEM_ALERT",
        channel="ALL",
        user_email=new_user.email,
        user_phone=new_user.phone
    )

    # 7. Audit log
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "")
    log_audit_event(
        db=db,
        action="USER_REGISTER",
        entity_type="USER",
        entity_id=str(new_user.id),
        user_id=new_user.id,
        user_email=new_user.email,
        user_role=new_user.role,
        ip_address=client_ip,
        user_agent=user_agent,
        details={"masked_aadhaar": masked_aadh, "role": role}
    )

    return new_user

@router.post("/login", response_model=Token)
def login_user(
    credentials: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate user by email or phone and return signed JWT with role claim.
    """
    identifier = credentials.email_or_phone.strip()
    user = db.query(User).filter((User.email == identifier) | (User.phone == identifier)).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/phone or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your account is deactivated. Please contact support."
        )

    # Generate token
    token = create_access_token(
        subject=user.id,
        role=user.role
    )

    # Audit log
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "")
    log_audit_event(
        db=db,
        action="USER_LOGIN",
        entity_type="USER",
        entity_id=str(user.id),
        user_id=user.id,
        user_email=user.email,
        user_role=user.role,
        ip_address=client_ip,
        user_agent=user_agent,
        details={"status": "SUCCESS", "role": user.role}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "preferred_language": user.preferred_language or "en"
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Returns profile information for the authenticated user."""
    return current_user

@router.post("/forgot-password")
def forgot_password(
    req: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """Generates password reset token and dispatches mock email/SMS."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Avoid user enumeration in production, return generic success
        return {"message": "If this email is registered, a password reset link has been dispatched."}

    reset_token_str = uuid.uuid4().hex
    token_hash = hash_aadhaar(reset_token_str)
    expires = datetime.now(timezone.utc) + timedelta(hours=2)

    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires,
        is_used=False
    )
    db.add(reset_record)
    db.commit()

    NotificationService.send_notification(
        db=db,
        user_id=user.id,
        title="Password Reset Request",
        message=f"A password reset request was initiated. Use reset token: {reset_token_str} to complete.",
        notification_type="SYSTEM_ALERT",
        channel="EMAIL_MOCK",
        user_email=user.email
    )

    return {
        "message": "If this email is registered, a password reset link has been dispatched.",
        "demo_reset_token": reset_token_str # Provided for development ease
    }

@router.post("/reset-password")
def reset_password(
    req: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Validates reset token and sets new password."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset request")

    token_h = hash_aadhaar(req.token)
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.token_hash == token_h,
        PasswordResetToken.is_used == False,
        PasswordResetToken.expires_at > datetime.now(timezone.utc)
    ).first()

    if not token_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    token_record.is_used = True
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()

    return {"message": "Password has been successfully updated. You may now login with your new credentials."}
