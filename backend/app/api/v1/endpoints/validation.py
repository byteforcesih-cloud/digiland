from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.verification import ValidationResult
from app.schemas.verification import ValidationResultOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[ValidationResultOut])
def get_validation_results(
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List validation rule execution results across documents."""
    query = db.query(ValidationResult)
    if status_filter:
        query = query.filter(ValidationResult.status == status_filter)
    return query.order_by(ValidationResult.id.desc()).all()

@router.get("/{document_id}", response_model=ValidationResultOut)
def get_document_validation(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve validation rules inspection for a specific document."""
    res = db.query(ValidationResult).filter(ValidationResult.document_id == document_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Validation result not found")
    return res
