from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.schemas.chatbot import ChatQueryRequest, ChatQueryResponse
from app.services.chatbot_service import ChatbotService

router = APIRouter()

@router.post("/chat", response_model=ChatQueryResponse)
def chat_with_assistant(
    req: ChatQueryRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Intelligent Context-Aware AI Chatbot Endpoint:
    - Natural language question understanding
    - Real-time authorized database querying (pending documents, storage, disputes)
    - Context-aware next steps
    - Procedural flowcharts with actionable buttons
    - Safe in-chat application navigation & language switching
    - Multilingual localized output
    """
    res = ChatbotService.get_response(
        query=req.message,
        language=req.language or "en",
        context_path=req.context_path,
        current_user=current_user,
        db=db
    )
    return res
