import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User
from app.models.document import Document, ExtractedField
from app.models.verification import DuplicateRecord
from app.db.session import SessionLocal
from app.core.security import create_access_token

client = TestClient(app)

@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def auth_headers(db_session):
    user = db_session.query(User).filter(User.role == "CITIZEN").first()
    if not user:
        user = User(
            full_name="Test Citizen",
            email="test_sync_citizen@example.com",
            phone="9876543210",
            role="CITIZEN",
            hashed_password="hashedpassword123",
            is_active=True,
            is_verified=True,
            verification_status="VERIFIED"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

    token = create_access_token(subject=str(user.id), role=user.role)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def officer_headers(db_session):
    officer = db_session.query(User).filter(User.role == "GOVERNMENT_OFFICER").first()
    if not officer:
        officer = User(
            full_name="Tahsildar Ramanathan",
            email="tahsildar_sync@example.com",
            phone="9876543211",
            role="GOVERNMENT_OFFICER",
            hashed_password="hashedpassword123",
            is_active=True,
            is_verified=True,
            verification_status="VERIFIED"
        )
        db_session.add(officer)
        db_session.commit()
        db_session.refresh(officer)

    token = create_access_token(subject=str(officer.id), role=officer.role)
    return {"Authorization": f"Bearer {token}"}

def test_land_search_endpoints(auth_headers):
    # Test cascading location dropdowns
    res_states = client.get("/api/v1/locations/states")
    assert res_states.status_code == 200
    assert "Tamil Nadu" in res_states.json()

    res_districts = client.get("/api/v1/locations/districts?state=Tamil%20Nadu")
    assert res_districts.status_code == 200

    # Test multi-parameter search
    res_search = client.get("/api/v1/gis/search?district=Chennai&survey_number=142/3A", headers=auth_headers)
    assert res_search.status_code == 200
    assert isinstance(res_search.json(), list)

def test_ai_review_generation(officer_headers, db_session):
    doc = db_session.query(Document).first()
    if doc:
        res = client.get(f"/api/v1/ai-review/{doc.id}", headers=officer_headers)
        assert res.status_code == 200
        data = res.json()
        assert "summary" in data
        assert "overall_ai_score" in data["summary"]
        assert "quality_grade" in data["summary"]
        assert "recommendations" in data
        assert isinstance(data["recommendations"], list)

def test_document_workflow_and_duplicate_sync(officer_headers, db_session):
    doc = db_session.query(Document).first()
    if doc:
        # Officer submits MARK_DUPLICATE
        payload = {
            "document_id": doc.id,
            "decision": "MARK_DUPLICATE",
            "remarks": "Suspected duplicate survey boundaries with historical registry",
            "correction_instructions": None,
            "field_adjustments": None
        }
        res = client.post("/api/v1/verification/submit", json=payload, headers=officer_headers)
        assert res.status_code == 200

        # Check document status updated
        db_session.refresh(doc)
        assert doc.status == "DUPLICATE_SUSPECTED"

        # Check Duplicate Detection module immediately returns the duplicate
        res_dups = client.get("/api/v1/duplicate", headers=officer_headers)
        assert res_dups.status_code == 200
        dups_list = res_dups.json()
        assert len(dups_list) > 0
        matched_entry = next((d for d in dups_list if d["document_id"] == doc.id or d["matched_document_id"] == doc.id), None)
        assert matched_entry is not None

def test_multilingual_chatbot(auth_headers):
    # Test English
    res_en = client.post("/api/v1/chatbot/chat", json={"message": "How to search land by Survey No?", "language": "en"}, headers=auth_headers)
    assert res_en.status_code == 200
    assert "Land" in res_en.json()["reply"] or "Search" in res_en.json()["reply"]

    # Test Tamil
    res_ta = client.post("/api/v1/chatbot/chat", json={"message": "பட்டா என்றால் என்ன?", "language": "ta"}, headers=auth_headers)
    assert res_ta.status_code == 200
    assert "பட்டா" in res_ta.json()["reply"] or "வருவாய்" in res_ta.json()["reply"]

    # Test Hindi
    res_hi = client.post("/api/v1/chatbot/chat", json={"message": "पट्टा क्या है?", "language": "hi"}, headers=auth_headers)
    assert res_hi.status_code == 200
    assert "पट्टा" in res_hi.json()["reply"] or "भूमि" in res_hi.json()["reply"]
