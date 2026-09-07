from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.api.deps import get_current_officer
from app.models.user import User
from app.models.document import Document
from app.models.approval_workflow import ApprovalWorkflow, ApprovalHistory
from app.services.multi_level_approval_service import multi_level_approval_service
from app.core.audit import log_audit_event

router = APIRouter()

class OfficerApprovalDecisionRequest(BaseModel):
    decision: str # "APPROVE", "REJECT", "REQUEST_CORRECTION", "ESCALATE_TO_LEVEL_2"
    remarks: str
    rejection_reason_category: Optional[str] = None

@router.get("/workflows")
def get_approval_workflows(
    level: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Retrieves document approval workflows filtered by current officer level (Level 1 / Level 2).
    """
    query = db.query(ApprovalWorkflow, Document).join(Document, ApprovalWorkflow.document_id == Document.id)
    if level is not None:
        query = query.filter(ApprovalWorkflow.current_level == level)
    if status_filter:
        query = query.filter(ApprovalWorkflow.status == status_filter)

    workflows = query.order_by(ApprovalWorkflow.updated_at.desc()).all()

    return [
        {
            "workflow_id": wf.id,
            "document_id": doc.id,
            "document_number": doc.document_number,
            "title": doc.title,
            "document_type": doc.document_type,
            "current_level": wf.current_level,
            "status": wf.status,
            "escalation_reason": wf.escalation_reason,
            "created_at": wf.created_at.isoformat() if wf.created_at else None,
            "updated_at": wf.updated_at.isoformat() if wf.updated_at else None
        }
        for wf, doc in workflows
    ]

@router.post("/{document_id}/decision")
def submit_approval_decision(
    document_id: int,
    payload: OfficerApprovalDecisionRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Records an official approval decision (Level 1 Tahsildar or Level 2 DRO).
    """
    try:
        res = multi_level_approval_service.record_decision(
            db=db,
            document_id=document_id,
            officer=current_officer,
            decision=payload.decision,
            remarks=payload.remarks,
            rejection_reason_category=payload.rejection_reason_category
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db,
        user_id=current_officer.id,
        action=f"OFFICER_DECISION_{payload.decision}",
        entity_type="DOCUMENT",
        entity_id=str(document_id),
        details={"decision": payload.decision, "remarks": payload.remarks},
        ip_address=client_ip
    )

    return res

@router.get("/{document_id}/history")
def get_approval_history(
    document_id: int,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Retrieves chronological multi-tier approval history and officer remarks for a document.
    """
    entries = (
        db.query(ApprovalHistory)
        .filter(ApprovalHistory.document_id == document_id)
        .order_by(ApprovalHistory.created_at.desc())
        .all()
    )

    return [
        {
            "id": e.id,
            "approval_level": e.approval_level,
            "officer_name": e.officer_name,
            "officer_designation": e.officer_designation,
            "decision": e.decision,
            "rejection_reason_category": e.rejection_reason_category,
            "remarks": e.remarks,
            "created_at": e.created_at.isoformat() if e.created_at else None
        }
        for e in entries
    ]
