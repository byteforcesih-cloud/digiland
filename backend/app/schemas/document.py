from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class ExtractedFieldOut(BaseModel):
    id: int
    field_name: str
    field_label: str
    field_value: Optional[str] = None
    confidence_score: float
    requires_human_verification: bool
    bounding_box: Optional[Dict[str, Any]] = None
    is_modified_by_officer: bool
    officer_modified_value: Optional[str] = None

    class Config:
        from_attributes = True

class ExtractedFieldUpdate(BaseModel):
    field_name: str
    new_value: str

class OCRResultOut(BaseModel):
    id: int
    raw_text: Optional[str] = None
    engine_used: str
    processing_time_ms: int
    overall_confidence: float
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentVersionOut(BaseModel):
    id: int
    version_number: int
    file_path: str
    file_hash: str
    change_summary: Optional[str] = None
    diff_detected: bool
    diff_details: Optional[Dict[str, Any]] = None
    officer_review_needed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentOut(BaseModel):
    id: int
    user_id: int
    document_number: str
    title: str
    document_type: str
    current_version: int
    status: str
    file_path: str
    file_type: str
    file_size: int
    original_filename: str
    thumbnail_path: Optional[str] = None
    is_locked: bool
    created_at: datetime
    updated_at: datetime
    extracted_fields: Optional[List[ExtractedFieldOut]] = None
    ocr_result: Optional[OCRResultOut] = None
    versions: Optional[List[DocumentVersionOut]] = None

    class Config:
        from_attributes = True

class DocumentUpdateVersionRequest(BaseModel):
    change_summary: str
