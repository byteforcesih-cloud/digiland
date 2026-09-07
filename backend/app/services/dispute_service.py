import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.land import LandRecord
from app.models.dispute import DisputeCase, DisputeEvidence, DisputeTimeline

class DisputeService:
    """
    Manages citizen land disputes, grievance filings, evidence attachments, and officer review timelines.
    """

    @classmethod
    def create_dispute(
        cls,
        db: Session,
        citizen: User,
        title: str,
        description: str,
        category: str,
        survey_number: str,
        village: str,
        taluk: str,
        district: str,
        state: str = "Tamil Nadu",
        land_record_id: Optional[int] = None,
        priority: str = "Medium"
    ) -> DisputeCase:
        """
        Creates a new land dispute case with unique sequential reference number.
        """
        random_suffix = uuid.uuid4().hex[:6].upper()
        case_number = f"DSP-TN-{datetime.now().year}-{random_suffix}"

        case = DisputeCase(
            case_number=case_number,
            citizen_id=citizen.id,
            land_record_id=land_record_id,
            survey_number=survey_number,
            village=village,
            taluk=taluk,
            district=district,
            state=state,
            title=title,
            description=description,
            category=category,
            status="Submitted",
            priority=priority
        )
        db.add(case)
        db.commit()
        db.refresh(case)

        # Initial timeline event
        initial_event = DisputeTimeline(
            dispute_id=case.id,
            actor_id=citizen.id,
            actor_role=citizen.role,
            action="DISPUTE_SUBMITTED",
            status_changed_to="Submitted",
            remarks=f"Grievance case registered by citizen for Survey Number {survey_number}."
        )
        db.add(initial_event)
        db.commit()

        return case

    @classmethod
    def update_dispute_status(
        cls,
        db: Session,
        dispute_id: int,
        officer: User,
        new_status: str,
        remarks: str,
        resolution_notes: Optional[str] = None
    ) -> DisputeCase:
        """
        Updates dispute status and appends a chronological audit event to the timeline.
        """
        case = db.query(DisputeCase).filter(DisputeCase.id == dispute_id).first()
        if not case:
            raise ValueError("Dispute case not found")

        case.status = new_status
        case.assigned_officer_id = officer.id
        if resolution_notes:
            case.resolution_notes = resolution_notes
        if new_status in ("Resolved", "Closed", "Rejected"):
            case.resolved_at = datetime.now(timezone.utc)

        timeline_event = DisputeTimeline(
            dispute_id=case.id,
            actor_id=officer.id,
            actor_role=officer.role,
            action="STATUS_UPDATED",
            status_changed_to=new_status,
            remarks=remarks
        )
        db.add(timeline_event)
        db.commit()
        db.refresh(case)
        return case

dispute_service = DisputeService()
