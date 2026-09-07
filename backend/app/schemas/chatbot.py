from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ActionButton(BaseModel):
    label: str
    path: str
    action_type: Optional[str] = "NAVIGATE"

class FlowchartStep(BaseModel):
    step: int
    title: str
    description: str
    action_btn: Optional[ActionButton] = None

class ChatbotAction(BaseModel):
    type: str # 'NAVIGATE' | 'CHANGE_LANGUAGE' | 'FILTER_DOCUMENTS' | 'OPEN_MODAL'
    path: Optional[str] = None
    language: Optional[str] = None
    language_label: Optional[str] = None
    filter: Optional[str] = None
    label: Optional[str] = None

class ChatQueryRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    context_path: Optional[str] = None
    history: Optional[List[ChatMessage]] = []

class ChatQueryResponse(BaseModel):
    reply: str
    suggested_actions: Optional[List[str]] = None
    related_topics: Optional[List[str]] = None
    flowchart: Optional[List[FlowchartStep]] = None
    action: Optional[ChatbotAction] = None
    live_data: Optional[Dict[str, Any]] = None
    is_out_of_scope: bool = False
    disclaimer: str = "Disclaimer: DigiLand AI Assistant provides informational guidance only. Official legal validity rests solely with authorized Revenue/Registration Government Officers."
