from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, require_verified_identity
from app.models.user import User
from app.models.document import Document
from app.services.integrity_service import integrity_service

router = APIRouter()

@router.get("/verify/{document_id}")
def verify_document_integrity(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Verifies the cryptographic SHA-256 block chain for a document.
    Returns whether the document is tamper-intact or shows an integrity mismatch.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to verify this document")

    result = integrity_service.verify_document_integrity(db, doc.id)
    return {
        "success": True,
        "document_number": doc.document_number,
        "document_title": doc.title,
        "data": result
    }

@router.get("/audit-chain/{document_id}")
def get_document_audit_chain(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verified_identity)
):
    """
    Retrieves the complete immutable audit block chain for a document.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to view this document audit chain")

    result = integrity_service.verify_document_integrity(db, doc.id)
    return {
        "success": True,
        "document_id": doc.id,
        "document_number": doc.document_number,
        "chain_terminology": "Blockchain-Inspired Tamper-Evident Audit Trail",
        "blocks": result["blocks"]
    }
