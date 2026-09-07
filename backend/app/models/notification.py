from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False) # 'DOCUMENT_UPLOADED', 'PROCESSING_COMPLETED', 'VERIFICATION_REQUIRED', 'DOCUMENT_APPROVED', 'DOCUMENT_REJECTED', etc.
    is_read = Column(Boolean, default=False, index=True)
    reference_type = Column(String(50), nullable=True) # e.g. "DOCUMENT"
    reference_id = Column(Integer, nullable=True)
    channel = Column(String(30), default="IN_APP") # 'IN_APP', 'SMS_MOCK', 'EMAIL_MOCK', 'ALL'
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="notifications")

class MockMessageLog(Base):
    __tablename__ = "mock_message_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    recipient_identifier = Column(String(150), nullable=False) # Email or Phone number
    channel = Column(String(20), nullable=False) # 'EMAIL' or 'SMS'
    template_type = Column(String(50), nullable=False) # 'OTP', 'WELCOME', 'STATUS_UPDATE', 'RESET_PASSWORD'
    payload = Column(Text, nullable=False)
    status = Column(String(20), default="DELIVERED")
    sent_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
