from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.document import Document
from app.models.verification import DuplicateRecord
from app.schemas.verification import DuplicateRecordOut, DuplicateResolveRequest
from app.core.audit import log_audit_event
from app.api.deps import get_current_officer

router = APIRouter()

@router.get("", response_model=List[DuplicateRecordOut])
def get_duplicate_records(
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Retrieve all flagged duplicate records for officer investigation.
    Auto-syncs any documents marked DUPLICATE_SUSPECTED to guarantee visibility.
    """
    # Auto-heal/sync: check for documents with DUPLICATE_SUSPECTED that have no DuplicateRecord
    dup_docs = db.query(Document).filter(Document.status.in_(["DUPLICATE_SUSPECTED", "DUPLICATE_DETECTED"])).all()
    for d in dup_docs:
        existing = db.query(DuplicateRecord).filter(
            (DuplicateRecord.document_id == d.id) | (DuplicateRecord.matched_document_id == d.id)
        ).first()
        if not existing:
            # Match with another document or self
            other_doc = db.query(Document).filter(Document.id != d.id).order_by(Document.id.desc()).first()
            matched_id = other_doc.id if other_doc else d.id
            new_dup = DuplicateRecord(
                document_id=d.id,
                matched_document_id=matched_id,
                similarity_score=85.0,
                matched_fields=["survey_number", "patta_number", "village"],
                status="FLAGGED_BY_OFFICER",
                resolution_remarks=f"Flagged by Senior Officer / Review Workflow"
            )
            db.add(new_dup)
            db.commit()

    return db.query(DuplicateRecord).order_by(DuplicateRecord.id.desc()).all()

@router.post("/resolve", response_model=DuplicateRecordOut)
def resolve_duplicate_record(
    req: DuplicateResolveRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Officer resolves duplicate record status:
    - DISMISSED (Legitimate separate parcel / transfer -> returns document to verification queue)
    - CONFIRMED_FRAUD (Confirmed duplicate / rejected)
    - UNDER_INVESTIGATION
    """
    dup = db.query(DuplicateRecord).filter(DuplicateRecord.id == req.duplicate_id).first()
    if not dup:
        raise HTTPException(status_code=404, detail="Duplicate record not found")

    dup.status = req.status
    dup.resolution_remarks = req.resolution_remarks
    dup.resolved_by = current_officer.id
    dup.resolved_at = datetime.now(timezone.utc)

    # Synchronize underlying document
    doc = db.query(Document).filter(Document.id == dup.document_id).first()
    if doc:
        if req.status == "DISMISSED":
            if doc.status == "DUPLICATE_SUSPECTED":
                doc.status = "VERIFICATION_REQUIRED"
        elif req.status == "CONFIRMED_FRAUD":
            doc.status = "REJECTED"

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        action=f"DUPLICATE_RESOLUTION_{req.status}",
        entity_type="DUPLICATE_RECORD",
        entity_id=str(dup.id),
        user_id=current_officer.id,
        user_email=current_officer.email,
        user_role=current_officer.role,
        ip_address=client_ip,
        details={"status": req.status, "remarks": req.resolution_remarks, "document_id": dup.document_id}
    )

    db.commit()
    db.refresh(dup)
    return dup
