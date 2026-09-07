from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base

class SecurityEvent(Base):
    """
    Tracks application-wide security monitoring events, suspicious requests, and policy triggers.
    """
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False, index=True) # FAILED_LOGIN, BRUTE_FORCE_ATTEMPT, UNAUTHORIZED_ACCESS, ANOMALOUS_UPLOAD, SESSION_HIJACK_SUSPECTED
    severity = Column(String(50), default="MEDIUM", index=True) # LOW, MEDIUM, HIGH, CRITICAL
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    user_email = Column(String(255), nullable=True, index=True)
    ip_address = Column(String(100), nullable=True)
    user_agent = Column(String(300), nullable=True)
    endpoint = Column(String(255), nullable=True)
    details = Column(JSON, nullable=True)
    is_reviewed = Column(Boolean, default=False)
    reviewed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class LoginHistory(Base):
    """
    Records all authentication attempts, successes, device info, and failure diagnostics.
    """
    __tablename__ = "login_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    user_email = Column(String(255), nullable=False, index=True)
    ip_address = Column(String(100), nullable=True)
    user_agent = Column(String(300), nullable=True)
    device_fingerprint = Column(String(200), nullable=True)
    is_successful = Column(Boolean, default=False, index=True)
    failure_reason = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class DeviceSession(Base):
    """
    Tracks active device sessions for user account management and remote revocation.
    """
    __tablename__ = "device_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_token_hash = Column(String(128), unique=True, nullable=False, index=True)
    device_name = Column(String(150), default="Chrome on Windows")
    device_type = Column(String(50), default="Desktop") # Desktop, Mobile, Tablet
    ip_address = Column(String(100), nullable=True)
    user_agent = Column(String(300), nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    last_active_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="device_sessions")


class SuspiciousActivity(Base):
    """
    Anomalous behavioral records flagged for security officer review.
    """
    __tablename__ = "suspicious_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    activity_type = Column(String(100), nullable=False, index=True) # RAPID_OTP_FAILURES, GEOLOCATION_DISCREPANCY, UNUSUAL_DOCUMENT_DOWNLOAD, CONCURRENT_IP_SESSIONS
    risk_score = Column(Integer, default=50) # 0-100
    details = Column(JSON, nullable=True)
    is_resolved = Column(Boolean, default=False, index=True)
    resolution_notes = Column(Text, nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
