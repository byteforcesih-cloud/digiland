import io
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.services.storage_service import storage_service

router = APIRouter()

@router.post("/upload")
async def upload_to_personal_storage(
    request: Request,
    file: UploadFile = File(...),
    folder_category: str = Form("Land Documents"),
    description: str = Form(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Uploads personal land papers/identity documents into 'My Secure Storage' with AES-256 encryption.
    """
    ip = request.client.host if request.client else "127.0.0.1"
    storage_file = await storage_service.upload_personal_file(
        db=db,
        user_id=current_user.id,
        file=file,
        folder_category=folder_category,
        description=description,
        ip_address=ip
    )
    
    return {
        "id": storage_file.id,
        "file_name": storage_file.original_name,
        "folder_category": storage_file.folder_category,
        "file_size": storage_file.file_size,
        "mime_type": storage_file.mime_type,
        "is_encrypted": storage_file.is_encrypted,
        "created_at": storage_file.created_at,
        "message": f"File '{storage_file.original_name}' securely encrypted and saved to personal vault."
    }

@router.get("/files")
def list_personal_files(
    category: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists personal files in 'My Secure Storage' with category filtering and keyword search.
    """
    files = storage_service.get_user_files(
        db=db,
        user_id=current_user.id,
        category=category,
        search_query=q
    )
    return [
        {
            "id": f.id,
            "file_name": f.original_name,
            "folder_category": f.folder_category,
            "file_size": f.file_size,
            "mime_type": f.mime_type,
            "is_encrypted": f.is_encrypted,
            "description": f.description,
            "created_at": f.created_at
        }
        for f in files
    ]

@router.get("/usage")
def get_personal_storage_usage(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns personal storage quota and live used bytes.
    """
    return storage_service.get_storage_usage(db, current_user.id)

@router.get("/files/{file_id}/download")
def download_personal_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Decrypts personal document in memory and streams secure download to owner.
    """
    plaintext, original_name, mime_type = storage_service.download_file(
        db=db,
        file_id=file_id,
        user_id=current_user.id
    )
    
    return StreamingResponse(
        io.BytesIO(plaintext),
        media_type=mime_type,
        headers={"Content-Disposition": f'attachment; filename="{original_name}"'}
    )

@router.delete("/files/{file_id}")
def delete_personal_file(
    file_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes personal file from disk and releases storage quota.
    """
    ip = request.client.host if request.client else "127.0.0.1"
    storage_service.delete_file(
        db=db,
        file_id=file_id,
        user_id=current_user.id,
        ip_address=ip
    )
    return {"status": "SUCCESS", "message": "File removed from personal storage."}
