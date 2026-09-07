import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from app.db.base import Base

class EmailDeliveryLog(Base):
    """
    Tracks email notifications, delivery statuses (PENDING, SENT, FAILED, RETRYING), and retry counts.
    """
    __tablename__ = "email_delivery_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    recipient_email = Column(String(255), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    body_text = Column(Text, nullable=False)
    template_type = Column(String(100), nullable=False) # DOCUMENT_UPLOAD, VERIFICATION_COMPLETE, etc.
    status = Column(String(50), default="PENDING", index=True) # PENDING, SENT, FAILED, RETRYING
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    sent_at = Column(DateTime, nullable=True)
    extra_payload = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
