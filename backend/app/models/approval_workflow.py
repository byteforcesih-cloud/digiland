from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class ApprovalWorkflow(Base):
    """
    State machine for multi-tier government officer approvals.
    Supports Level 1 (Verification Officer / Tahsildar) and Level 2 (Senior Verification Officer / DRO).
    """
    __tablename__ = "approval_workflows"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    current_level = Column(Integer, default=1, index=True) # Level 1 (Initial Review), Level 2 (Senior / Escalated Review)
    status = Column(String(50), default="Pending Level 1 Review", index=True) 
    # Statuses: Pending Level 1 Review, Pending Level 2 Review, Escalated, Approved, Rejected, Correction Requested
    
    assigned_officer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    escalated_to_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    escalation_reason = Column(Text, nullable=True)
    
    final_decision = Column(String(50), nullable=True)
    final_remarks = Column(Text, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="approval_workflow")
    history_entries = relationship("ApprovalHistory", back_populates="workflow", cascade="all, delete-orphan", order_by="ApprovalHistory.created_at.desc()")


class ApprovalHistory(Base):
    """
    Audit log of all individual level decisions, remarks, and escalations by officers.
    """
    __tablename__ = "approval_history"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("approval_workflows.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    officer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    officer_name = Column(String(200), nullable=True)
    officer_designation = Column(String(150), nullable=True)
    approval_level = Column(Integer, nullable=False) # 1 or 2
    decision = Column(String(50), nullable=False) # APPROVED, REJECTED, CORRECTION_REQUESTED, ESCALATED_TO_LEVEL_2
    rejection_reason_category = Column(String(100), nullable=True) # BOUNDARY_DISCREPANCY, OWNER_NAME_MISMATCH, SUSPICIOUS_TAMPERING, INCOMPLETE_PATTA_SCHEDULE, OTHER
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    workflow = relationship("ApprovalWorkflow", back_populates="history_entries")
