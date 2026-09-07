import uuid
import random
from datetime import datetime, timedelta
from typing import Tuple, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.aadhaar import OTPRequest

class OTPService:
    """
    Simulated Identity OTP Service with 5-minute TTL, retry tracking, and expiration.
    In development mode, OTP is logged to server console and safely returned in response for demo convenience.
    """
    
    EXPIRY_MINUTES = 5
    MAX_RETRIES = 3
    
    @staticmethod
    def generate_otp(db: Session, user_id: int, aadhaar_number: str, phone_number: str) -> Tuple[str, str, datetime]:
        """
        Creates a new OTP session and returns (session_id, otp_code, expires_at).
        """
        # Invalidate existing active OTPs for this user
        db.query(OTPRequest).filter(
            OTPRequest.user_id == user_id,
            OTPRequest.is_used == False
        ).update({"is_used": True})
        
        session_id = f"OTP-{uuid.uuid4().hex[:12].upper()}"
        otp_code = str(random.randint(100000, 999999)) # 6-digit OTP
        expires_at = datetime.utcnow() + timedelta(minutes=OTPService.EXPIRY_MINUTES)
        
        otp_req = OTPRequest(
            user_id=user_id,
            session_id=session_id,
            aadhaar_number=aadhaar_number,
            phone_number=phone_number,
            otp_code=otp_code,
            expires_at=expires_at,
            is_used=False,
            retry_count=0,
            max_retries=OTPService.MAX_RETRIES
        )
        
        db.add(otp_req)
        db.commit()
        db.refresh(otp_req)
        
        print(f"[DEMO IDENTITY OTP] Session: {session_id} | User: #{user_id} | Phone: {phone_number} | OTP: {otp_code} | Expires: {expires_at}")
        return session_id, otp_code, expires_at

    @staticmethod
    def verify_otp(db: Session, user_id: int, session_id: str, submitted_otp: str) -> Tuple[bool, str, Optional[str]]:
        """
        Verifies submitted OTP. Returns (is_valid, message, aadhaar_number).
        """
        otp_req = db.query(OTPRequest).filter(
            OTPRequest.session_id == session_id,
            OTPRequest.user_id == user_id
        ).first()
        
        if not otp_req:
            return False, "Invalid OTP session. Please request a new OTP.", None
            
        if otp_req.is_used:
            return False, "This OTP has already been used. Please request a new one.", None
            
        if datetime.utcnow() > otp_req.expires_at:
            otp_req.is_used = True
            db.commit()
            return False, "OTP has expired (5-minute validity exceeded). Please request a new OTP.", None
            
        if otp_req.retry_count >= otp_req.max_retries:
            otp_req.is_used = True
            db.commit()
            return False, "Maximum retry attempts exceeded (3). Please request a new OTP.", None
            
        if otp_req.otp_code != submitted_otp.strip():
            otp_req.retry_count += 1
            remaining = otp_req.max_retries - otp_req.retry_count
            db.commit()
            return False, f"Incorrect OTP entered. {remaining} attempt(s) remaining.", None
            
        # Success
        otp_req.is_used = True
        db.commit()
        return True, "Mock OTP verified successfully.", otp_req.aadhaar_number

otp_service = OTPService()
