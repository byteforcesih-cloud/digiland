from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class FraudAnalysisResult(Base):
    """
    Detailed findings from AI / Heuristic Document Tampering & Anomaly Analysis.
    """
    __tablename__ = "fraud_analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    overall_risk_score = Column(Integer, default=15, index=True) # 0 - 100
    risk_level = Column(String(50), default="Low Risk", index=True) # Low Risk, Medium Risk, High Risk, Critical Risk, Requires Officer Review
    
    # Granular Analysis Scores (0.0 to 100.0)
    image_tamper_score = Column(Float, default=10.0) # High indicates potential clone/copy-paste or splice
    ocr_consistency_score = Column(Float, default=95.0) # Low indicates font mismatch or misaligned text layers
    metadata_inconsistency_score = Column(Float, default=5.0) # High indicates modified EXIF or creation date anomalies
    duplicate_similarity_score = Column(Float, default=0.0) # Similarity with existing registry deeds
    
    # Anomaly Details
    anomaly_flags = Column(JSON, default=list) # e.g. ["UNUSUAL_FONT_IN_SURVEY_SCHEDULE", "DISCREPANT_EXIF_CREATOR_TOOL"]
    metadata_inconsistencies = Column(JSON, default=dict)
    suspicious_regions = Column(JSON, default=list) # Bounding boxes of suspected manipulated regions
    
    # Officer Review & Conclusion
    is_reviewed_by_officer = Column(Boolean, default=False, index=True)
    officer_remarks = Column(Text, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    
    disclaimer = Column(String(255), default="Potential Document Anomaly Detected — Requires Human Review")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="fraud_analysis")


class DocumentRiskScore(Base):
    """
    Composite 0-100 risk score combining fraud indicators, identity factors, and OCR confidence.
    """
    __tablename__ = "document_risk_scores"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    total_score = Column(Integer, default=20, index=True) # 0-100
    risk_band = Column(String(50), default="LOW", index=True) # LOW (0-30), MEDIUM (31-60), HIGH (61-80), CRITICAL (81-100)
    factor_breakdown = Column(JSON, nullable=False, default=dict) # { "ocr_confidence_factor": 5, "identity_verification_factor": 0, "tamper_analysis_factor": 10, ... }
    is_escalated = Column(Boolean, default=False, index=True) # High risk automatically escalated to Senior Officer
    escalation_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="risk_score")
