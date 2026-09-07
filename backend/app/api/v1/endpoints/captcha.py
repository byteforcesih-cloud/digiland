from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
from app.db.session import get_db
from app.services.captcha_service import captcha_service

router = APIRouter()

class VerifyCaptchaRequest(BaseModel):
    captcha_token: str
    user_answer: str

@router.get("/challenge")
def get_captcha_challenge(
    request: Request,
    action_type: str = "SENSITIVE_ACTION",
    db: Session = Depends(get_db)
):
    """
    Generates a server-side math/logic CAPTCHA challenge for sensitive workflows.
    """
    ip = request.client.host if request and request.client else "127.0.0.1"
    challenge = captcha_service.generate_challenge(db, action_type=action_type, ip_address=ip)
    return challenge

@router.post("/verify")
def verify_captcha_challenge(
    payload: VerifyCaptchaRequest,
    db: Session = Depends(get_db)
):
    """
    Validates user solution against stored server challenge.
    """
    is_valid, msg = captcha_service.verify_challenge(db, payload.captcha_token, payload.user_answer)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "SUCCESS", "message": msg}
