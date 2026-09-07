from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[AuditLogOut])
def get_audit_logs(
    action: Optional[str] = None,
    entity_type: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns audit history trail:
    - Citizens: Only their own activities.
    - Officers/Admins: All system audit trail records.
    """
    query = db.query(AuditLog)
    if current_user.role == "CITIZEN":
        query = query.filter(AuditLog.user_id == current_user.id)
    
    if action:
        query = query.filter(AuditLog.action == action)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)

    return query.order_by(AuditLog.id.desc()).limit(limit).all()
