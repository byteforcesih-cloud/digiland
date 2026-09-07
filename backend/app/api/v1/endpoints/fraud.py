from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.api.deps import get_current_user, get_current_officer, require_verified_identity
from app.models.user import User
from app.models.document import Document
from app.models.fraud_risk import FraudAnalysisResult, DocumentRiskScore
from app.services.fraud_detection_service import fraud_detection_service
from app.core.audit import log_audit_event

router = APIRouter()

class OfficerFraudReviewRequest(BaseModel):
    remarks: str
    decision_override: Optional[str] = None # e.g. "APPROVED_AFTER_MANUAL_INSPECTION", "CONFIRMED_TAMPERED"

@router.post("/analyze/{document_id}")
def analyze_document_fraud(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Triggers AI / Heuristic fraud and anomaly analysis for a document.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to analyze this document")

    result = fraud_detection_service.analyze_document_fraud(db, doc)

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db,
        user_id=current_user.id,
        action="DOCUMENT_FRAUD_ANALYSIS",
        entity_type="DOCUMENT",
        entity_id=str(doc.id),
        details={"risk_score": result["overall_risk_score"], "risk_level": result["risk_level"]},
        ip_address=client_ip
    )

    return {
        "success": True,
        "data": result
    }

@router.get("/analysis/{document_id}")
def get_document_fraud_analysis(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Retrieves the stored fraud and anomaly analysis results for a document.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to access this document analysis")

    fraud_rec = db.query(FraudAnalysisResult).filter(FraudAnalysisResult.document_id == doc.id).first()
    if not fraud_rec:
        # Run analysis on-the-fly
        res = fraud_detection_service.analyze_document_fraud(db, doc)
        return {"success": True, "data": res}

    risk_rec = db.query(DocumentRiskScore).filter(DocumentRiskScore.document_id == doc.id).first()

    return {
        "success": True,
        "data": {
            "document_id": doc.id,
            "overall_risk_score": fraud_rec.overall_risk_score,
            "risk_level": fraud_rec.risk_level,
            "risk_band": risk_rec.risk_band if risk_rec else "LOW",
            "is_escalated": risk_rec.is_escalated if risk_rec else False,
            "escalation_reason": risk_rec.escalation_reason if risk_rec else None,
            "image_tamper_score": fraud_rec.image_tamper_score,
            "ocr_consistency_score": fraud_rec.ocr_consistency_score,
            "metadata_inconsistency_score": fraud_rec.metadata_inconsistency_score,
            "anomaly_flags": fraud_rec.anomaly_flags,
            "suspicious_regions": fraud_rec.suspicious_regions,
            "is_reviewed_by_officer": fraud_rec.is_reviewed_by_officer,
            "officer_remarks": fraud_rec.officer_remarks,
            "disclaimer": fraud_rec.disclaimer
        }
    }

@router.get("/review-queue")
def get_fraud_review_queue(
    min_risk: int = 30,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Officer queue listing high-risk / anomalous documents requiring human verification.
    """
    results = (
        db.query(FraudAnalysisResult, Document)
        .join(Document, FraudAnalysisResult.document_id == Document.id)
        .filter(FraudAnalysisResult.overall_risk_score >= min_risk)
        .order_by(FraudAnalysisResult.overall_risk_score.desc())
        .all()
    )

    return [
        {
            "document_id": doc.id,
            "document_number": doc.document_number,
            "title": doc.title,
            "document_type": doc.document_type,
            "status": doc.status,
            "overall_risk_score": fraud.overall_risk_score,
            "risk_level": fraud.risk_level,
            "anomaly_flags": fraud.anomaly_flags,
            "is_reviewed": fraud.is_reviewed_by_officer,
            "uploaded_at": doc.created_at.isoformat() if doc.created_at else None
        }
        for fraud, doc in results
    ]

@router.post("/review/{document_id}")
def submit_officer_fraud_review(
    document_id: int,
    payload: OfficerFraudReviewRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Allows authorized revenue officers to attach review remarks and conclusions to an anomalous document.
    """
    fraud_rec = db.query(FraudAnalysisResult).filter(FraudAnalysisResult.document_id == document_id).first()
    if not fraud_rec:
        raise HTTPException(status_code=404, detail="Fraud analysis record not found")

    fraud_rec.is_reviewed_by_officer = True
    fraud_rec.officer_remarks = payload.remarks
    fraud_rec.reviewed_by = current_officer.id
    from datetime import datetime, timezone
    fraud_rec.reviewed_at = datetime.now(timezone.utc)

    db.commit()

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db,
        user_id=current_officer.id,
        action="OFFICER_FRAUD_REVIEW_SUBMITTED",
        entity_type="DOCUMENT",
        entity_id=str(document_id),
        details={"remarks": payload.remarks},
        ip_address=client_ip
    )

    return {
        "success": True,
        "message": "Officer review recorded successfully.",
        "document_id": document_id,
        "is_reviewed": True
    }
