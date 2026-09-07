import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.db.base import Base

class CaptchaAttempt(Base):
    """
    Stores server-side generated CAPTCHA challenges, expiration, and validation state.
    """
    __tablename__ = "captcha_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(100), unique=True, index=True, nullable=False)
    answer_hash = Column(String(255), nullable=False) # SHA-256 hash of correct answer
    action_type = Column(String(100), default="SENSITIVE_ACTION") # REGISTER, LOGIN_ATTEMPT, OTP_REQUEST
    ip_address = Column(String(100), nullable=True)
    is_verified = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
