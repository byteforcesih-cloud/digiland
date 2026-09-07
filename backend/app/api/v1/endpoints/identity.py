from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.aadhaar import IdentityVerification, MockAadhaarProfile
from app.services.mock_aadhaar_service import mock_aadhaar_service
from app.services.phone_validation_service import phone_validation_service
from app.services.otp_service import otp_service
from app.services.email_service import email_service
from app.core.audit import log_audit_event

router = APIRouter()

class RequestOTPRequest(BaseModel):
    aadhaar_number: str = Field(..., description="12-Digit Aadhaar Number")
    captcha_token: Optional[str] = None
    captcha_answer: Optional[str] = None

class ConfirmOTPRequest(BaseModel):
    session_id: str
    otp_code: str

@router.post("/aadhaar/request-otp")
def request_aadhaar_otp(
    payload: RequestOTPRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Step 1: Validates 12-digit Aadhaar format, looks up synthetic Mock Aadhaar database,
    performs mandatory normalized phone number matching, and generates simulated OTP.
    """
    raw_aadhaar = payload.aadhaar_number
    if not mock_aadhaar_service.validate_format(raw_aadhaar):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aadhaar number must contain exactly 12 numeric digits."
        )
        
    profile = mock_aadhaar_service.find_by_aadhaar(db, raw_aadhaar)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No synthetic demo profile matches this Aadhaar number. Please use a seeded demo profile."
        )

    # 1. MANDATORY PHONE NUMBER MATCHING (Section 2 of requirements)
    is_phone_match, phone_result = phone_validation_service.validate_phone_match(db, current_user, profile)
    if not is_phone_match:
        # Keep user UNVERIFIED and stop verification process
        current_user.verification_status = "UNVERIFIED"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The phone number associated with this account does not match the phone number linked to the provided Mock Aadhaar record."
        )
        
    clean_aadhaar = mock_aadhaar_service.normalize_aadhaar(raw_aadhaar)
    phone = profile.phone_number or current_user.phone
    
    session_id, otp_code, expires_at = otp_service.generate_otp(
        db,
        user_id=current_user.id,
        aadhaar_number=clean_aadhaar,
        phone_number=phone
    )
    
    # Update user status to OTP_PENDING
    current_user.verification_status = "OTP_PENDING"
    db.commit()
    
    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db,
        user_id=current_user.id,
        action="AADHAAR_OTP_REQUESTED",
        entity_type="IDENTITY_VERIFICATION",
        entity_id=str(current_user.id),
        details={"aadhaar_masked": mock_aadhaar_service.mask_aadhaar(clean_aadhaar), "session_id": session_id, "phone_masked": phone_result},
        ip_address=client_ip
    )
    
    return {
        "status": "OTP_SENT",
        "session_id": session_id,
        "phone_masked": f"+91 {phone_result}",
        "aadhaar_masked": mock_aadhaar_service.mask_aadhaar(clean_aadhaar),
        "demo_otp": otp_code, # Displayed safely in dev mode for testing convenience
        "expires_in_seconds": 300,
        "message": f"Simulated 6-digit OTP sent to registered mobile for demo profile '{profile.full_name}'."
    }

@router.post("/aadhaar/confirm-otp")
def confirm_aadhaar_otp(
    payload: ConfirmOTPRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Step 2: Verifies simulated OTP, fetches synthetic demo profile, and marks user as VERIFIED.
    """
    is_valid, msg, clean_aadhaar = otp_service.verify_otp(
        db,
        user_id=current_user.id,
        session_id=payload.session_id,
        submitted_otp=payload.otp_code
    )
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=msg
        )
        
    profile = mock_aadhaar_service.find_by_aadhaar(db, clean_aadhaar)
    
    # Update User Record
    current_user.is_verified = True
    current_user.verification_status = "VERIFIED"
    current_user.aadhaar_masked = mock_aadhaar_service.mask_aadhaar(clean_aadhaar)
    if profile:
        current_user.full_name = profile.full_name
        
    # Record Verification Entry
    ident_rec = IdentityVerification(
        user_id=current_user.id,
        aadhaar_number=mock_aadhaar_service.mask_aadhaar(clean_aadhaar),
        status="VERIFIED",
        verified_profile_id=profile.id if profile else None,
        verified_at=datetime.now(timezone.utc)
    )
    db.add(ident_rec)
    db.commit()
    
    # Dispatch confirmation notification & email
    email_service.send_email_sync(
        db,
        recipient_email=current_user.email,
        template_type="IDENTITY_VERIFIED",
        template_vars={"aadhaar_masked": current_user.aadhaar_masked},
        user_id=current_user.id
    )
    
    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db,
        user_id=current_user.id,
        action="IDENTITY_VERIFIED_SUCCESS",
        entity_type="IDENTITY_VERIFICATION",
        entity_id=str(ident_rec.id),
        details={"verified_name": profile.full_name if profile else current_user.full_name},
        ip_address=client_ip
    )
    
    return {
        "status": "VERIFIED",
        "message": "Identity Verification Successful! Access granted to all application services.",
        "profile": {
            "full_name": profile.full_name if profile else current_user.full_name,
            "date_of_birth": profile.date_of_birth if profile else "1988-05-14",
            "gender": profile.gender if profile else "Male",
            "address": profile.address if profile else "Chennai, Tamil Nadu",
            "village": profile.village if profile else "Mylapore",
            "district": profile.district if profile else "Chennai",
            "state": profile.state if profile else "Tamil Nadu",
            "aadhaar_masked": current_user.aadhaar_masked
        }
    }

@router.get("/status")
def get_identity_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns current identity verification status for the logged-in user.
    """
    latest_ver = db.query(IdentityVerification).filter(
        IdentityVerification.user_id == current_user.id
    ).order_by(IdentityVerification.created_at.desc()).first()
    
    profile = None
    if latest_ver and latest_ver.verified_profile_id:
        profile = db.query(MockAadhaarProfile).filter(
            MockAadhaarProfile.id == latest_ver.verified_profile_id
        ).first()
        
    return {
        "user_id": current_user.id,
        "is_verified": current_user.is_verified,
        "verification_status": current_user.verification_status or ("VERIFIED" if current_user.is_verified else "UNVERIFIED"),
        "aadhaar_masked": current_user.aadhaar_masked,
        "registered_phone": current_user.phone,
        "profile": {
            "full_name": profile.full_name if profile else current_user.full_name,
            "date_of_birth": profile.date_of_birth if profile else None,
            "gender": profile.gender if profile else None,
            "address": profile.address if profile else None,
            "district": profile.district if profile else None,
            "state": profile.state if profile else None,
            "phone_number": profile.phone_number if profile else None
        } if profile else None
    }

@router.get("/demo-profiles")
def get_demo_aadhaar_profiles(
    limit: int = 65,
    db: Session = Depends(get_db)
):
    """
    Returns list of synthetic demo Aadhaar profiles for 1-click selection in UI.
    """
    mock_aadhaar_service.seed_mock_profiles_if_empty(db)
    profiles = mock_aadhaar_service.get_all_demo_profiles(db, limit=limit)
    return [
        {
            "id": p.id,
            "aadhaar_number": p.aadhaar_number,
            "full_name": p.full_name,
            "date_of_birth": p.date_of_birth,
            "gender": p.gender,
            "village": p.village,
            "taluk": p.taluk,
            "district": p.district,
            "state": p.state,
            "phone_number": p.phone_number
        }
        for p in profiles
    ]
