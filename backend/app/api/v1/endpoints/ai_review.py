from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.document import Document
from app.services.ai_review_service import ai_review_service
from app.api.deps import get_current_user
from app.core.audit import log_audit_event

router = APIRouter()

@router.get("/{document_id}")
def get_document_ai_review(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves or generates unified AI Review for a land document:
    - Compulsory for Officer Verification Queue inspection
    - Available on-demand for citizens and officers in document details
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role == "CITIZEN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to access this document AI review")

    try:
        review_data = ai_review_service.get_or_generate_ai_review(db, document_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AI Review: {str(e)}")

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        action="DOCUMENT_AI_REVIEW_VIEWED",
        entity_type="DOCUMENT",
        entity_id=str(doc.id),
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role,
        ip_address=client_ip,
        details={"version": doc.current_version, "ai_score": review_data["summary"]["overall_ai_score"]}
    )

    return review_data

@router.post("/{document_id}/regenerate")
def regenerate_document_ai_review(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Force regenerates AI Review following document re-upload or human field corrections.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role == "CITIZEN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to regenerate AI review for this document")

    try:
        review_data = ai_review_service.get_or_generate_ai_review(db, document_id, force_regenerate=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to regenerate AI Review: {str(e)}")

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        action="DOCUMENT_AI_REVIEW_REGENERATED",
        entity_type="DOCUMENT",
        entity_id=str(doc.id),
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role,
        ip_address=client_ip,
        details={"version": doc.current_version, "ai_score": review_data["summary"]["overall_ai_score"]}
    )

    return review_data
