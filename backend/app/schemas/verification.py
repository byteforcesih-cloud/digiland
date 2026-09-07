from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.schemas.document import ExtractedFieldOut, DocumentOut

class VerificationSubmitRequest(BaseModel):
    document_id: int
    decision: str # 'APPROVE', 'REJECT', 'REQUEST_CORRECTION', 'MARK_DUPLICATE', 'MARK_ALTERED'
    remarks: Optional[str] = None
    correction_instructions: Optional[str] = None
    field_adjustments: Optional[Dict[str, str]] = None # {"survey_number": "142/3B", ...}

class VerificationRecordOut(BaseModel):
    id: int
    document_id: int
    officer_id: int
    verification_status: str
    remarks: Optional[str] = None
    correction_instructions: Optional[str] = None
    field_adjustments: Optional[Dict[str, Any]] = None
    verification_date: datetime

    class Config:
        from_attributes = True

class ValidationResultOut(BaseModel):
    id: int
    document_id: int
    status: str
    error_count: int
    warning_count: int
    validation_rules_passed: int
    validation_rules_total: int
    mismatch_details: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DuplicateRecordOut(BaseModel):
    id: int
    document_id: int
    matched_document_id: int
    similarity_score: float
    matched_fields: List[str]
    status: str
    resolution_remarks: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    document: Optional[DocumentOut] = None
    matched_document: Optional[DocumentOut] = None

    class Config:
        from_attributes = True

class DuplicateResolveRequest(BaseModel):
    duplicate_id: int
    status: str # 'DISMISSED', 'CONFIRMED_FRAUD', 'UNDER_INVESTIGATION'
    resolution_remarks: str
