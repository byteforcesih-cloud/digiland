from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.user import User, GovernmentOfficer
from app.models.document import Document
from app.models.approval_workflow import ApprovalWorkflow, ApprovalHistory
from app.models.fraud_risk import DocumentRiskScore

class MultiLevelApprovalService:
    """
    Coordinates multi-tier officer reviews and escalations:
      Level 1: Verification Officer / Tahsildar (Normal Risk)
      Level 2: Senior Verification Officer / Revenue Divisional Officer / DRO (High/Critical Risk or Escalated)
    """

    @classmethod
    def initialize_workflow(cls, db: Session, document: Document) -> ApprovalWorkflow:
        """
        Creates an approval workflow entity when a document is submitted for verification.
        """
        workflow = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.document_id == document.id).first()
        if workflow:
            return workflow

        # Check document risk score
        risk_score = db.query(DocumentRiskScore).filter(DocumentRiskScore.document_id == document.id).first()
        is_high_risk = risk_score.is_escalated if risk_score else False

        initial_level = 2 if is_high_risk else 1
        initial_status = "Pending Level 2 Review" if is_high_risk else "Pending Level 1 Review"

        workflow = ApprovalWorkflow(
            document_id=document.id,
            current_level=initial_level,
            status=initial_status,
            escalation_reason="High risk score detected at ingestion" if is_high_risk else None
        )
        db.add(workflow)
        db.commit()
        db.refresh(workflow)
        return workflow

    @classmethod
    def record_decision(
        cls,
        db: Session,
        document_id: int,
        officer: User,
        decision: str, # "APPROVE", "REJECT", "REQUEST_CORRECTION", "MARK_DUPLICATE", "ESCALATE_TO_LEVEL_2"
        remarks: str,
        rejection_reason_category: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes an officer review decision, updating workflow state and document status.
        """
        from app.services.document_workflow_service import document_workflow_service
        return document_workflow_service.update_document_status(
            db=db,
            document_id=document_id,
            decision=decision,
            officer=officer,
            remarks=remarks,
            rejection_reason=rejection_reason_category
        )

multi_level_approval_service = MultiLevelApprovalService()
