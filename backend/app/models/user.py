from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False)
    module = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    age = Column(Integer, nullable=False)
    aadhaar_hash = Column(String(128), nullable=True)
    aadhaar_masked = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="CITIZEN", index=True, nullable=False) # 'CITIZEN', 'GOVERNMENT_OFFICER', 'ADMIN'
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    verification_status = Column(String(50), default="VERIFIED", index=True) # 'VERIFIED', 'UNVERIFIED'
    storage_quota_mb = Column(Integer, default=1024)
    storage_used_bytes = Column(Integer, default=0)
    preferred_language = Column(String(10), default="en")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    officer_profile = relationship("GovernmentOfficer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    land_records = relationship("LandRecord", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    identity_verifications = relationship("IdentityVerification", back_populates="user", cascade="all, delete-orphan")
    storage_quota = relationship("UserStorageQuota", back_populates="user", uselist=False, cascade="all, delete-orphan")
    storage_files = relationship("StorageFile", back_populates="user", cascade="all, delete-orphan")
    device_sessions = relationship("DeviceSession", back_populates="user", cascade="all, delete-orphan")

class GovernmentOfficer(Base):
    __tablename__ = "government_officers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    officer_code = Column(String(50), unique=True, nullable=False)
    badge_number = Column(String(50), unique=True, nullable=False)
    designation = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    taluk = Column(String(100), nullable=False)
    jurisdiction_scope = Column(Text, nullable=True) # JSON Array of authorized regions
    is_authorized = Column(Boolean, default=True)
    total_verifications_completed = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="officer_profile")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
