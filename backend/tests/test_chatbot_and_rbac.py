import pytest
from app.services.chatbot_service import chatbot_service
from app.db.session import SessionLocal
from app.models.user import User
from app.models.document import Document
from app.core.security import get_password_hash

def test_natural_upload_question_flowchart():
    queries = [
        "How can I upload my land document?",
        "I have a property paper. How do I add it to DigiLand?",
        "Where can I upload my document?",
        "How to add land deed?"
    ]
    for q in queries:
        res = chatbot_service.get_response(q, "en")
        assert res["flowchart"] is not None
        assert len(res["flowchart"]) >= 3
        assert any("Scan" in step.title or "Upload" in step.title for step in res["flowchart"])
        assert res["is_out_of_scope"] is False

def test_in_chat_language_switching():
    # Tamil command
    res_ta = chatbot_service.get_response("Change language to Tamil", "en")
    assert res_ta["action"] is not None
    assert res_ta["action"]["type"] == "CHANGE_LANGUAGE"
    assert res_ta["action"]["language"] == "ta"

    # Native script Tamil command
    res_ta2 = chatbot_service.get_response("தமிழுக்கு மாற்று", "en")
    assert res_ta2["action"] is not None
    assert res_ta2["action"]["language"] == "ta"

    # Hindi command
    res_hi = chatbot_service.get_response("Switch to Hindi", "en")
    assert res_hi["action"] is not None
    assert res_hi["action"]["language"] == "hi"

def test_in_chat_safe_navigation():
    res_docs = chatbot_service.get_response("Open my documents", "en")
    assert res_docs["action"] is not None
    assert res_docs["action"]["type"] == "NAVIGATE"
    assert res_docs["action"]["path"] == "/citizen/documents"

    res_gis = chatbot_service.get_response("Open GIS map", "en")
    assert res_gis["action"] is not None
    assert res_gis["action"]["path"] == "/citizen/gis"

    res_search = chatbot_service.get_response("Take me to land search", "en")
    assert res_search["action"] is not None
    assert res_search["action"]["path"] == "/citizen/search"

def test_out_of_scope_guardrail_refusal():
    out_of_scope_queries = [
        "Who won the cricket match yesterday?",
        "How to cook chicken biryani?",
        "What is the weather in Delhi today?",
        "Tell me a funny joke"
    ]
    for q in out_of_scope_queries:
        res = chatbot_service.get_response(q, "en")
        assert res["is_out_of_scope"] is True
        assert "unable to provide a reliable answer" in res["reply"].lower() or "outside" in res["reply"].lower()

def test_live_database_querying_in_chatbot():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "chatbot_test_user@example.com").first()
        if not user:
            user = User(
                email="chatbot_test_user@example.com",
                hashed_password=get_password_hash("Test@123"),
                full_name="Chatbot Tester",
                phone="9876543210",
                age=35,
                aadhaar_hash="cb_test_hash_1",
                aadhaar_masked="XXXX-XXXX-4321",
                role="CITIZEN",
                is_active=True,
                is_verified=True,
                verification_status="VERIFIED"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Ensure a test document exists
        doc = db.query(Document).filter(Document.user_id == user.id).first()
        if not doc:
            doc = Document(
                user_id=user.id,
                document_number="DOC-CB-TEST-001",
                title="Test Patta Deed",
                document_type="PATTA_CHITTA",
                file_path="uploads/test.pdf",
                file_type="application/pdf",
                file_size=2048,
                original_filename="test_patta_deed.pdf",
                status="PENDING"
            )
            db.add(doc)
            db.commit()

        res = chatbot_service.get_response("How many of my documents are pending?", "en", current_user=user, db=db)
        assert res["live_data"] is not None
        assert res["live_data"]["pending"] >= 1
        assert "Pending Verification" in res["reply"]
    finally:
        db.close()

def test_direct_citizen_navigation_in_chatbot():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "unverified_cb_user@example.com").first()
        if not user:
            user = User(
                email="unverified_cb_user@example.com",
                hashed_password=get_password_hash("Test@123"),
                full_name="Direct Citizen",
                phone="9876543211",
                age=28,
                role="CITIZEN",
                is_active=True,
                is_verified=True,
                verification_status="VERIFIED"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        res = chatbot_service.get_response("Open my documents", "en", current_user=user, db=db)
        assert res["action"] is not None
        assert res["action"]["path"] == "/citizen/documents"
    finally:
        db.close()
