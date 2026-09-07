from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class VerificationRecord(Base):
    __tablename__ = "verification_records"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    verification_status = Column(String(50), nullable=False) # 'VERIFIED', 'REJECTED', 'CORRECTION_REQUESTED', etc.
    remarks = Column(Text, nullable=True)
    correction_instructions = Column(Text, nullable=True)
    field_adjustments = Column(JSON, nullable=True)
    verification_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    document = relationship("Document", back_populates="verification_records")
    officer = relationship("User")

class ValidationResult(Base):
    __tablename__ = "validation_results"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    status = Column(String(50), default="NEEDS_REVIEW") # 'VALID', 'NEEDS_REVIEW', 'INVALID', 'VERIFICATION_PENDING'
    error_count = Column(Integer, default=0)
    warning_count = Column(Integer, default=0)
    validation_rules_passed = Column(Integer, default=0)
    validation_rules_total = Column(Integer, default=10)
    mismatch_details = Column(JSON, nullable=True) # List of dicts: [{"rule": "...", "severity": "...", "message": "..."}]
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    document = relationship("Document", back_populates="validation_result")

class DuplicateRecord(Base):
    __tablename__ = "duplicate_records"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    matched_document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False) # 0.00 to 100.00
    matched_fields = Column(JSON, nullable=False) # ["survey_number", "village", "owner_name"]
    status = Column(String(50), default="DETECTED") # 'DETECTED', 'UNDER_INVESTIGATION', 'DISMISSED', 'CONFIRMED_FRAUD'
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolution_remarks = Column(Text, nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    document = relationship("Document", foreign_keys=[document_id])
    matched_document = relationship("Document", foreign_keys=[matched_document_id])
