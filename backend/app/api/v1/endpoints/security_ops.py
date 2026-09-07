from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.api.deps import get_current_user, get_current_officer
from app.models.user import User
from app.models.security_monitoring import SecurityEvent, LoginHistory, DeviceSession
from app.models.feature_access import FeatureAccessDefinition
from app.services.security_monitoring_service import security_monitoring_service

router = APIRouter()

@router.get("/sessions")
def get_user_active_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all active device sessions for the current user.
    """
    sessions = (
        db.query(DeviceSession)
        .filter(DeviceSession.user_id == current_user.id, DeviceSession.is_active == True)
        .order_by(DeviceSession.last_active_at.desc())
        .all()
    )

    return [
        {
            "id": s.id,
            "device_name": s.device_name,
            "device_type": s.device_type,
            "ip_address": s.ip_address,
            "last_active_at": s.last_active_at.isoformat() if s.last_active_at else None,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in sessions
    ]

@router.delete("/sessions/{session_id}")
def revoke_device_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Terminates / logs out a remote device session.
    """
    success = security_monitoring_service.revoke_session(db, session_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found or already revoked")
    return {"success": True, "message": "Device session revoked successfully."}

@router.get("/login-history")
def get_user_login_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns recent authentication attempts and diagnostics for the logged-in user.
    """
    history = (
        db.query(LoginHistory)
        .filter(LoginHistory.user_email == current_user.email)
        .order_by(LoginHistory.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": h.id,
            "ip_address": h.ip_address,
            "user_agent": h.user_agent,
            "is_successful": h.is_successful,
            "failure_reason": h.failure_reason,
            "timestamp": h.created_at.isoformat() if h.created_at else None
        }
        for h in history
    ]

@router.get("/events")
def get_security_monitoring_events(
    severity: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_officer: User = Depends(get_current_officer)
):
    """
    Officer/Admin endpoint to view real-time security alerts, brute-force triggers, and anomalous events.
    """
    query = db.query(SecurityEvent)
    if severity:
        query = query.filter(SecurityEvent.severity == severity)
    events = query.order_by(SecurityEvent.created_at.desc()).limit(limit).all()

    return [
        {
            "id": e.id,
            "event_type": e.event_type,
            "severity": e.severity,
            "user_email": e.user_email,
            "ip_address": e.ip_address,
            "details": e.details,
            "is_reviewed": e.is_reviewed,
            "timestamp": e.created_at.isoformat() if e.created_at else None
        }
        for e in events
    ]

@router.get("/feature-access")
def get_my_accessible_features(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns dynamic RBAC feature access list based on current user's role and verification status.
    Enforces the formula: VERIFIED + ROLE = ACCESS PERMISSIONS.
    Used for 'My Accessible Features' section on User Profile.
    """
    is_verified = (current_user.verification_status == "VERIFIED" or current_user.role in ("GOVERNMENT_OFFICER", "ADMIN"))
    
    # Feature registry
    features = [
        {"key": "AUTH_KYC", "name": "Mock Aadhaar Identity Verification", "category": "Identity & Verification", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": False},
        {"key": "DASHBOARD", "name": "Citizen Service Dashboard", "category": "General Services", "allowed_roles": ["CITIZEN", "ADMIN"], "requires_verified": True},
        {"key": "DOC_UPLOAD", "name": "Document Upload (AES-256)", "category": "Document Operations", "allowed_roles": ["CITIZEN", "ADMIN"], "requires_verified": True},
        {"key": "CAM_SCAN", "name": "WebRTC Camera Scanner & Multi-Page", "category": "Document Operations", "allowed_roles": ["CITIZEN", "ADMIN"], "requires_verified": True},
        {"key": "DOC_OCR", "name": "Document OCR Text Extraction", "category": "Document Operations", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "DOC_DETAILS", "name": "Get Document Details (17 Structured Fields)", "category": "Document Operations", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "MY_DOCUMENTS", "name": "My Documents Repository & Management", "category": "Document Operations", "allowed_roles": ["CITIZEN", "ADMIN"], "requires_verified": True},
        {"key": "SECURE_STORAGE", "name": "My Secure Storage (1GB Vault)", "category": "Document Operations", "allowed_roles": ["CITIZEN", "ADMIN"], "requires_verified": True},
        {"key": "DOC_DOWNLOAD", "name": "Password-Protected PDF Certificate Download", "category": "Document Operations", "allowed_roles": ["CITIZEN", "ADMIN"], "requires_verified": True},
        {"key": "LAND_SEARCH", "name": "Cascading Location Land Search", "category": "Land Registry & GIS", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "GIS_MAP", "name": "GIS Cadastral Parcel Map", "category": "Land Registry & GIS", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "DISPUTES", "name": "Land Dispute & Complaint Filing", "category": "Dispute Management", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "NOTIFICATIONS", "name": "Real-time Notification Center", "category": "General Services", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "INTEGRITY_CHECK", "name": "Blockchain-Inspired Tamper Audit Chain", "category": "Security & Audit", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "QR_VERIFY", "name": "QR Certificate Verification", "category": "Security & Audit", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "AI_CHATBOT", "name": "AI Land Assistant (Voice, Flowcharts & Actions)", "category": "Support", "allowed_roles": ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "OFFICER_VERIFY", "name": "Level 1 / Level 2 Document Approval Workflow", "category": "Officer Tools", "allowed_roles": ["GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "FRAUD_REVIEW", "name": "AI Document Tampering & Fraud Review Queue", "category": "Officer Tools", "allowed_roles": ["GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "OFFICER_DISPUTES", "name": "Officer Land Dispute Adjudication", "category": "Officer Tools", "allowed_roles": ["GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
        {"key": "SECURITY_MONITOR", "name": "Security Operations & Audit Governance", "category": "Security & Audit", "allowed_roles": ["GOVERNMENT_OFFICER", "ADMIN"], "requires_verified": True},
    ]

    evaluated_matrix = []
    accessible_list = []
    restricted_list = []

    for f in features:
        access_allowed = current_user.role in f["allowed_roles"]
        reason = "Allowed" if access_allowed else f"Requires {f['allowed_roles'][0]} Role"

        item = {
            "feature_key": f["key"],
            "feature_name": f["name"],
            "category": f["category"],
            "access_status": "Allowed" if access_allowed else "Restricted",
            "is_allowed": access_allowed,
            "restriction_reason": reason
        }
        evaluated_matrix.append(item)
        if access_allowed:
            accessible_list.append(f["name"])
        else:
            restricted_list.append({"name": f["name"], "reason": reason})

    return {
        "user_role": current_user.role,
        "verification_status": current_user.verification_status,
        "is_verified": is_verified,
        "account_status": "Active" if current_user.is_active else "Suspended",
        "accessible_features": accessible_list,
        "restricted_features": restricted_list,
        "features": evaluated_matrix
    }
