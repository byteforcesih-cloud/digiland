from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, require_verified_identity
from app.models.user import User
from app.models.document import Document
from app.services.qr_verification_service import qr_verification_service

router = APIRouter()

@router.post("/generate/{document_id}")
def generate_document_qr_token(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Generates a secure QR verification token for an approved document.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to generate QR token for this document")

    qr_rec = qr_verification_service.generate_verification_token(db, doc)

    return {
        "success": True,
        "document_id": doc.id,
        "verification_token": qr_rec.verification_token,
        "verification_url": qr_rec.verification_url,
        "is_active": qr_rec.is_active,
        "expires_at": qr_rec.expires_at.isoformat() if qr_rec.expires_at else None
    }

@router.get("/public/resolve/{token}")
def public_resolve_qr_token(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Public resolution endpoint for scanning QR codes on certificates.
    Returns limited authorized status metadata without exposing citizen PII or internal IDs.
    """
    result = qr_verification_service.resolve_public_token(db, token)
    if not result.get("is_valid"):
        raise HTTPException(status_code=404, detail=result.get("message", "Invalid token"))
    return result
