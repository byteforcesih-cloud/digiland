from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, GovernmentOfficer
from app.models.document import Document, ExtractedField
from app.models.land import LandRecord
from app.models.verification import VerificationRecord, ValidationResult, DuplicateRecord
from app.schemas.verification import VerificationSubmitRequest, VerificationRecordOut, ValidationResultOut
from app.schemas.document import DocumentOut
from app.core.audit import log_audit_event
from app.services.notification_service import NotificationService
from app.api.deps import get_current_officer

router = APIRouter()

@router.get("/queue", response_model=List[DocumentOut])
def get_officer_verification_queue(
    filter_status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Returns documents requiring government officer attention:
    - PENDING
    - VERIFICATION_REQUIRED
    - DUPLICATE_SUSPECTED
    - POTENTIALLY_ALTERED
    """
    query = db.query(Document)
    if filter_status:
        query = query.filter(Document.status == filter_status)
    else:
        query = query.filter(Document.status.in_([
            "VERIFICATION_REQUIRED",
            "PENDING",
            "DUPLICATE_SUSPECTED",
            "POTENTIALLY_ALTERED",
            "UNABLE_TO_VERIFY"
        ]))
    return query.order_by(Document.id.desc()).all()

@router.get("/review/{document_id}")
def get_split_screen_review_data(
    document_id: int,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Returns structured data for the Split-Screen Verification Interface:
    - Document metadata & original file URL
    - Extracted fields with confidence scores & bounding boxes
    - Automated Validation Result & mismatch flags
    - Duplicate check outcome
    - Previous verification actions
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    fields = db.query(ExtractedField).filter(ExtractedField.document_id == doc.id).all()
    validation = db.query(ValidationResult).filter(ValidationResult.document_id == doc.id).first()
    duplicate = db.query(DuplicateRecord).filter(
        (DuplicateRecord.document_id == doc.id) | (DuplicateRecord.matched_document_id == doc.id)
    ).first()
    verifications = db.query(VerificationRecord).filter(VerificationRecord.document_id == doc.id).order_by(VerificationRecord.id.desc()).all()
    land_rec = db.query(LandRecord).filter(LandRecord.document_id == doc.id).first()

    return {
        "document": {
            "id": doc.id,
            "document_number": doc.document_number,
            "title": doc.title,
            "document_type": doc.document_type,
            "current_version": doc.current_version,
            "status": doc.status,
            "file_path": doc.file_path,
            "file_type": doc.file_type,
            "file_size": doc.file_size,
            "original_filename": doc.original_filename,
            "created_at": doc.created_at
        },
        "extracted_fields": [
            {
                "id": f.id,
                "field_name": f.field_name,
                "field_label": f.field_label,
                "field_value": f.field_value,
                "confidence_score": f.confidence_score,
                "requires_human_verification": f.requires_human_verification,
                "bounding_box": f.bounding_box,
                "is_modified_by_officer": f.is_modified_by_officer,
                "officer_modified_value": f.officer_modified_value
            }
            for f in fields
        ],
        "validation_result": {
            "status": validation.status if validation else "VALID",
            "error_count": validation.error_count if validation else 0,
            "warning_count": validation.warning_count if validation else 0,
            "validation_rules_passed": validation.validation_rules_passed if validation else 10,
            "validation_rules_total": validation.validation_rules_total if validation else 10,
            "mismatch_details": validation.mismatch_details if validation else []
        } if validation else None,
        "duplicate_detection": {
            "similarity_score": duplicate.similarity_score,
            "matched_fields": duplicate.matched_fields,
            "status": duplicate.status,
            "matched_document_id": duplicate.matched_document_id
        } if duplicate else None,
        "land_record": {
            "id": land_rec.id,
            "owner_name": land_rec.owner_name,
            "survey_number": land_rec.survey_number,
            "patta_number": land_rec.patta_number,
            "village": land_rec.village,
            "taluk": land_rec.taluk,
            "district": land_rec.district,
            "land_area": land_rec.land_area,
            "area_unit": land_rec.area_unit,
            "status": land_rec.status
        } if land_rec else None,
        "history": [
            {
                "id": v.id,
                "officer_name": v.officer.full_name if v.officer else "Government Officer",
                "verification_status": v.verification_status,
                "remarks": v.remarks,
                "correction_instructions": v.correction_instructions,
                "verification_date": v.verification_date
            }
            for v in verifications
        ]
    }

@router.post("/submit", response_model=VerificationRecordOut)
def submit_officer_verification(
    req: VerificationSubmitRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Submits official human-in-the-loop government verification verdict:
    - Decisions: APPROVE, REJECT, REQUEST_CORRECTION, MARK_DUPLICATE, MARK_ALTERED
    - Records officer field adjustments
    - Updates Document & LandRecord statuses
    - Creates immutable AuditLog
    - Dispatches Citizen Notification
    """
    doc = db.query(Document).filter(Document.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    decision = req.decision.upper()
    status_mapping = {
        "APPROVE": "VERIFIED",
        "REJECT": "REJECTED",
        "REQUEST_CORRECTION": "CORRECTION_REQUESTED",
        "MARK_DUPLICATE": "DUPLICATE_SUSPECTED",
        "MARK_ALTERED": "POTENTIALLY_ALTERED"
    }

    if decision not in status_mapping:
        raise HTTPException(status_code=400, detail=f"Invalid decision '{req.decision}'")

    target_status = status_mapping[decision]
    previous_status = doc.status

    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "")

    from app.services.document_workflow_service import document_workflow_service
    res = document_workflow_service.update_document_status(
        db=db,
        document_id=doc.id,
        decision=decision,
        officer=current_officer,
        remarks=req.remarks,
        correction_instructions=req.correction_instructions,
        field_adjustments=req.field_adjustments,
        client_ip=client_ip,
        user_agent=user_agent
    )

    ver_record = db.query(VerificationRecord).filter(
        VerificationRecord.document_id == doc.id
    ).order_by(VerificationRecord.id.desc()).first()

    return ver_record
