import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class MockAadhaarProfile(Base):
    """
    Synthetic Demo Aadhaar Records (Hackathon / Demonstration only).
    Does NOT connect to or claim access to real UIDAI/Aadhaar databases.
    """
    __tablename__ = "mock_aadhaar_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    aadhaar_number = Column(String(20), unique=True, index=True, nullable=False) # e.g. "9901-2345-6789"
    full_name = Column(String(255), nullable=False)
    date_of_birth = Column(String(50), nullable=False)
    gender = Column(String(20), nullable=False) # "Male", "Female", "Other"
    address = Column(Text, nullable=False)
    village = Column(String(100), nullable=False)
    taluk = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False, default="Tamil Nadu")
    pincode = Column(String(20), nullable=False)
    phone_number = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True)
    verification_status = Column(String(50), default="VERIFIED")
    is_demo_data = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class IdentityVerification(Base):
    """
    Tracks user identity verification status and history.
    """
    __tablename__ = "identity_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    aadhaar_number = Column(String(20), nullable=False)
    status = Column(String(50), default="UNVERIFIED") # UNVERIFIED, OTP_PENDING, VERIFIED, FAILED
    verified_profile_id = Column(Integer, ForeignKey("mock_aadhaar_profiles.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    failure_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="identity_verifications")
    verified_profile = relationship("MockAadhaarProfile")


class OTPRequest(Base):
    """
    Simulated OTP requests with 5-minute TTL, retry tracking, and expiration.
    """
    __tablename__ = "otp_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    aadhaar_number = Column(String(20), nullable=False)
    phone_number = Column(String(20), nullable=False)
    otp_code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
