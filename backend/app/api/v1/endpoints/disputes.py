import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.api.deps import get_current_user, get_current_officer, require_verified_identity
from app.models.user import User
from app.models.dispute import DisputeCase, DisputeEvidence, DisputeTimeline
from app.services.dispute_service import dispute_service
from app.core.audit import log_audit_event

router = APIRouter()

class CreateDisputeRequest(BaseModel):
    title: str
    description: str
    category: str = "BOUNDARY_DISPUTE" # BOUNDARY_DISPUTE, ENCROACHMENT, TITLE_DISPUTE, FRAUDULENT_MUTATION, DOUBLE_REGISTRATION, INHERITANCE_ISSUE, OTHER
    survey_number: str
    village: str
    taluk: str
    district: str
    state: str = "Tamil Nadu"
    land_record_id: Optional[int] = None
    priority: str = "Medium"

class UpdateDisputeStatusRequest(BaseModel):
    new_status: str # Submitted, Assigned, Under Review, Evidence Review, Additional Information Required, Resolved, Rejected, Closed
    remarks: str
    resolution_notes: Optional[str] = None

@router.post("/create")
def create_dispute_case(
    payload: CreateDisputeRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Citizen endpoint to register a formal land grievance or boundary dispute.
    """
    case = dispute_service.create_dispute(
        db=db,
        citizen=current_user,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        survey_number=payload.survey_number,
        village=payload.village,
        taluk=payload.taluk,
        district=payload.district,
        state=payload.state,
        land_record_id=payload.land_record_id,
        priority=payload.priority
    )

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db,
        user_id=current_user.id,
        action="DISPUTE_FILED",
        entity_type="DISPUTE",
        entity_id=str(case.id),
        details={"case_number": case.case_number, "survey_number": case.survey_number},
        ip_address=client_ip
    )

    return {
        "success": True,
        "message": "Dispute case registered successfully.",
        "case_number": case.case_number,
        "dispute_id": case.id,
        "status": case.status
    }

@router.get("/my-disputes")
def get_my_disputes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Lists all grievances and dispute cases filed by the logged-in citizen.
    """
    cases = (
        db.query(DisputeCase)
        .filter(DisputeCase.citizen_id == current_user.id)
        .order_by(DisputeCase.created_at.desc())
        .all()
    )

    return [
        {
            "id": c.id,
            "case_number": c.case_number,
            "title": c.title,
            "category": c.category,
            "survey_number": c.survey_number,
            "village": c.village,
            "district": c.district,
            "status": c.status,
            "priority": c.priority,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "resolved_at": c.resolved_at.isoformat() if c.resolved_at else None
        }
        for c in cases
    ]

@router.get("/officer/queue")
def get_officer_dispute_queue(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Officer queue to inspect, assign, and resolve citizen land disputes.
    """
    query = db.query(DisputeCase)
    if status_filter:
        query = query.filter(DisputeCase.status == status_filter)

    cases = query.order_by(DisputeCase.created_at.desc()).all()

    return [
        {
            "id": c.id,
            "case_number": c.case_number,
            "citizen_name": c.citizen.full_name if c.citizen else "Citizen",
            "title": c.title,
            "category": c.category,
            "survey_number": c.survey_number,
            "village": c.village,
            "district": c.district,
            "status": c.status,
            "priority": c.priority,
            "assigned_officer": c.assigned_officer.full_name if c.assigned_officer else "Unassigned",
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in cases
    ]

@router.get("/{dispute_id}")
def get_dispute_details(
    dispute_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Retrieves full dispute case details, attached evidences, and chronological timeline.
    """
    case = db.query(DisputeCase).filter(DisputeCase.id == dispute_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Dispute case not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and case.citizen_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to access this dispute")

    return {
        "id": case.id,
        "case_number": case.case_number,
        "citizen_name": case.citizen.full_name if case.citizen else "Citizen",
        "title": case.title,
        "description": case.description,
        "category": case.category,
        "survey_number": case.survey_number,
        "village": case.village,
        "taluk": case.taluk,
        "district": case.district,
        "state": case.state,
        "status": case.status,
        "priority": case.priority,
        "assigned_officer": case.assigned_officer.full_name if case.assigned_officer else None,
        "resolution_notes": case.resolution_notes,
        "created_at": case.created_at.isoformat() if case.created_at else None,
        "resolved_at": case.resolved_at.isoformat() if case.resolved_at else None,
        "evidences": [
            {
                "id": ev.id,
                "file_name": ev.file_name,
                "file_size": ev.file_size,
                "description": ev.description,
                "created_at": ev.created_at.isoformat() if ev.created_at else None
            }
            for ev in case.evidences
        ],
        "timeline": [
            {
                "id": t.id,
                "actor_role": t.actor_role,
                "action": t.action,
                "status_changed_to": t.status_changed_to,
                "remarks": t.remarks,
                "timestamp": t.created_at.isoformat() if t.created_at else None
            }
            for t in case.timeline_events
        ]
    }

@router.post("/{dispute_id}/update-status")
def update_dispute_status(
    dispute_id: int,
    payload: UpdateDisputeStatusRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Officer endpoint to update grievance status and log remarks to timeline.
    """
    try:
        updated = dispute_service.update_dispute_status(
            db=db,
            dispute_id=dispute_id,
            officer=current_officer,
            new_status=payload.new_status,
            remarks=payload.remarks,
            resolution_notes=payload.resolution_notes
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db,
        user_id=current_officer.id,
        action="DISPUTE_STATUS_UPDATED",
        entity_type="DISPUTE",
        entity_id=str(dispute_id),
        details={"status": payload.new_status, "remarks": payload.remarks},
        ip_address=client_ip
    )

    return {
        "success": True,
        "message": "Dispute case status updated successfully.",
        "case_number": updated.case_number,
        "status": updated.status
    }
