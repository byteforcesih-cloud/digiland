from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base

class DisputeCase(Base):
    """
    Land disputes, boundary grievances, and encroachment complaints filed by citizens.
    """
    __tablename__ = "dispute_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), unique=True, nullable=False, index=True) # e.g. "DSP-TN-2026-0042"
    citizen_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    land_record_id = Column(Integer, ForeignKey("land_records.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Core Dispute Information
    survey_number = Column(String(100), nullable=False, index=True)
    village = Column(String(150), nullable=False)
    taluk = Column(String(150), nullable=False)
    district = Column(String(150), nullable=False)
    state = Column(String(150), default="Tamil Nadu")
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="BOUNDARY_DISPUTE") # BOUNDARY_DISPUTE, ENCROACHMENT, TITLE_DISPUTE, FRAUDULENT_MUTATION, DOUBLE_REGISTRATION, INHERITANCE_ISSUE, OTHER
    status = Column(String(50), default="Submitted", index=True) # Submitted, Assigned, Under Review, Evidence Review, Additional Information Required, Resolved, Rejected, Closed
    priority = Column(String(50), default="Medium") # Low, Medium, High, Urgent
    
    # Officer Assignment & Resolution
    assigned_officer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    resolution_notes = Column(Text, nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    citizen = relationship("User", foreign_keys=[citizen_id])
    assigned_officer = relationship("User", foreign_keys=[assigned_officer_id])
    land_record = relationship("LandRecord")
    evidences = relationship("DisputeEvidence", back_populates="dispute_case", cascade="all, delete-orphan")
    timeline_events = relationship("DisputeTimeline", back_populates="dispute_case", cascade="all, delete-orphan", order_by="DisputeTimeline.created_at.asc()")


class DisputeEvidence(Base):
    """
    Supporting evidence files (encroachment photos, prior tax receipts, survey sketches) for dispute cases.
    """
    __tablename__ = "dispute_evidence"

    id = Column(Integer, primary_key=True, index=True)
    dispute_id = Column(Integer, ForeignKey("dispute_cases.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), default="application/pdf")
    description = Column(Text, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    dispute_case = relationship("DisputeCase", back_populates="evidences")


class DisputeTimeline(Base):
    """
    Chronological progress and audit trail for land dispute cases.
    """
    __tablename__ = "dispute_timeline"

    id = Column(Integer, primary_key=True, index=True)
    dispute_id = Column(Integer, ForeignKey("dispute_cases.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_role = Column(String(50), default="CITIZEN")
    action = Column(String(100), nullable=False) # DISPUTE_SUBMITTED, OFFICER_ASSIGNED, STATUS_UPDATED, EVIDENCE_ATTACHED, REMARKS_POSTED, DISPUTE_RESOLVED
    status_changed_to = Column(String(50), nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    dispute_case = relationship("DisputeCase", back_populates="timeline_events")
