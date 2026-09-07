from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class DocumentExtractedDetails(Base):
    """
    Structured document details extracted by the DocumentDetailsExtractionService from OCR text.
    Maintains raw extracted values, confidence scores, and user-confirmed modifications.
    """
    __tablename__ = "document_extracted_details"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    # Core Document Metadata
    document_type = Column(String(100), nullable=True)
    document_title = Column(String(255), nullable=True)
    document_number = Column(String(100), nullable=True)
    registration_number = Column(String(100), nullable=True)
    document_date = Column(String(50), nullable=True)
    registration_date = Column(String(50), nullable=True)
    issue_date = Column(String(50), nullable=True)
    
    # Ownership & Applicant Details
    owner_name = Column(String(200), nullable=True, index=True)
    applicant_name = Column(String(200), nullable=True)
    parent_guardian_name = Column(String(200), nullable=True)
    
    # Land Identification
    survey_number = Column(String(100), nullable=True, index=True)
    subdivision_number = Column(String(50), nullable=True)
    patta_number = Column(String(100), nullable=True, index=True)
    plot_number = Column(String(100), nullable=True)
    khata_number = Column(String(100), nullable=True)
    khasra_number = Column(String(100), nullable=True)
    
    # Location Hierarchy
    door_number = Column(String(50), nullable=True)
    street_name = Column(String(200), nullable=True)
    address = Column(Text, nullable=True)
    village = Column(String(150), nullable=True, index=True)
    taluk = Column(String(150), nullable=True, index=True)
    district = Column(String(150), nullable=True, index=True)
    state = Column(String(150), nullable=True, default="Tamil Nadu")
    pincode = Column(String(20), nullable=True)
    
    # Land Properties
    land_area = Column(String(100), nullable=True)
    land_classification = Column(String(150), nullable=True)
    
    # JSON Payloads
    extracted_data = Column(JSON, nullable=False, default=dict) # { field_key: { "value": "...", "confidence": 0.95, "confidence_level": "High Confidence" } }
    confidence_data = Column(JSON, nullable=False, default=dict) # Summary statistics & confidence scores
    user_confirmed_data = Column(JSON, nullable=True) # User-edited & verified values
    is_confirmed = Column(Boolean, default=False)
    confirmed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    document = relationship("Document", back_populates="extracted_details")
