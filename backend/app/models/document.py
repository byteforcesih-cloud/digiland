from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    document_number = Column(String(100), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    document_type = Column(String(50), default="PATTA_CHITTA", nullable=False)
    current_version = Column(Integer, default=1)
    status = Column(String(50), default="PENDING", index=True)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=False)
    original_filename = Column(String(255), nullable=False)
    thumbnail_path = Column(String(500), nullable=True)
    is_locked = Column(Boolean, default=False)
    is_encrypted = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="documents")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan", order_by="DocumentVersion.version_number.desc()")
    extracted_fields = relationship("ExtractedField", back_populates="document", cascade="all, delete-orphan")
    ocr_result = relationship("OCRResult", back_populates="document", uselist=False, cascade="all, delete-orphan")
    validation_result = relationship("ValidationResult", back_populates="document", uselist=False, cascade="all, delete-orphan")
    verification_records = relationship("VerificationRecord", back_populates="document", cascade="all, delete-orphan")
    land_record = relationship("LandRecord", back_populates="document", uselist=False)
    encryption_metadata = relationship("DocumentEncryptionMetadata", back_populates="document", uselist=False, cascade="all, delete-orphan")
    extracted_details = relationship("DocumentExtractedDetails", back_populates="document", uselist=False, cascade="all, delete-orphan")
    fraud_analysis = relationship("FraudAnalysisResult", back_populates="document", uselist=False, cascade="all, delete-orphan")
    risk_score = relationship("DocumentRiskScore", back_populates="document", uselist=False, cascade="all, delete-orphan")
    integrity_chain = relationship("IntegrityAuditChain", back_populates="document", cascade="all, delete-orphan", order_by="IntegrityAuditChain.block_index.asc()")
    qr_tokens = relationship("QRVerificationToken", back_populates="document", cascade="all, delete-orphan")
    approval_workflow = relationship("ApprovalWorkflow", back_populates="document", uselist=False, cascade="all, delete-orphan")

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    file_hash = Column(String(128), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    change_summary = Column(Text, nullable=True)
    diff_detected = Column(Boolean, default=False)
    diff_details = Column(JSON, nullable=True)
    officer_review_needed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    document = relationship("Document", back_populates="versions")

class ExtractedField(Base):
    __tablename__ = "extracted_fields"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name = Column(String(100), nullable=False)
    field_label = Column(String(150), nullable=False)
    field_value = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=False) # 0.00 to 100.00
    requires_human_verification = Column(Boolean, default=False)
    bounding_box = Column(JSON, nullable=True) # { "x": 100, "y": 200, "w": 140, "h": 24, "page": 1 }
    is_modified_by_officer = Column(Boolean, default=False)
    officer_modified_value = Column(Text, nullable=True)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    document = relationship("Document", back_populates="extracted_fields")

class OCRResult(Base):
    __tablename__ = "ocr_results"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True)
    raw_text = Column(Text, nullable=True)
    engine_used = Column(String(50), default="DIGILAND_OCR_v2_NEURAL")
    processing_time_ms = Column(Integer, default=350)
    overall_confidence = Column(Float, default=88.5)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    document = relationship("Document", back_populates="ocr_result")
