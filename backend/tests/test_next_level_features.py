import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.db.session import SessionLocal
from app.models.user import User
from app.models.document import Document
from app.models.aadhaar import MockAadhaarProfile

client = TestClient(app)

@pytest.fixture
def db_session():
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture
def citizen_user(db_session):
    user = db_session.query(User).filter(User.email == "citizen@digiland.gov.in").first()
    user.verification_status = "VERIFIED"
    user.is_verified = True
    db_session.commit()
    return user

@pytest.fixture
def citizen_token(citizen_user):
    return create_access_token(subject=citizen_user.id, role=citizen_user.role)

@pytest.fixture
def officer_token(db_session):
    user = db_session.query(User).filter(User.email == "officer@digiland.gov.in").first()
    return create_access_token(subject=user.id, role=user.role)

def test_phone_number_matching_in_aadhaar_verification(citizen_token, db_session):
    # Test phone mismatch check: using a demo profile that belongs to another citizen
    mismatch_profile = db_session.query(MockAadhaarProfile).filter(MockAadhaarProfile.phone_number != "9840123456").first()
    assert mismatch_profile is not None

    headers = {"Authorization": f"Bearer {citizen_token}"}
    response = client.post(
        "/api/v1/identity/aadhaar/request-otp",
        json={"aadhaar_number": mismatch_profile.aadhaar_number},
        headers=headers
    )
    # Must fail because registered user phone (9840123456) != profile phone
    assert response.status_code == 400
    assert "The phone number associated with this account does not match" in response.json()["detail"]

def test_fraud_detection_and_risk_scoring(officer_token, db_session):
    doc = db_session.query(Document).first()
    assert doc is not None

    headers = {"Authorization": f"Bearer {officer_token}"}
    res = client.get(f"/api/v1/fraud/analysis/{doc.id}", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "overall_risk_score" in data
    assert "risk_level" in data
    assert "disclaimer" in data

def test_blockchain_integrity_audit_chain(citizen_user, citizen_token, db_session):
    doc = db_session.query(Document).filter(Document.user_id == citizen_user.id).first()
    assert doc is not None

    headers = {"Authorization": f"Bearer {citizen_token}"}
    res = client.get(f"/api/v1/integrity/verify/{doc.id}", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["is_intact"] is True
    assert data["integrity_status"] == "Integrity Verified"

def test_qr_verification_public_resolution(citizen_user, citizen_token, db_session):
    doc = db_session.query(Document).filter(Document.user_id == citizen_user.id).first()
    assert doc is not None

    headers = {"Authorization": f"Bearer {citizen_token}"}
    gen_res = client.post(f"/api/v1/qr/generate/{doc.id}", headers=headers)
    assert gen_res.status_code == 200
    token = gen_res.json()["verification_token"]

    # Public endpoint without auth header
    pub_res = client.get(f"/api/v1/qr/public/resolve/{token}")
    assert pub_res.status_code == 200
    pub_data = pub_res.json()
    assert pub_data["is_valid"] is True
    assert "document_reference_number" in pub_data
    assert "blockchain_block_hash" in pub_data

def test_dispute_creation_and_timeline(citizen_token):
    headers = {"Authorization": f"Bearer {citizen_token}"}
    res = client.post(
        "/api/v1/disputes/create",
        json={
            "title": "Road Widening Encroachment Grievance",
            "description": "Boundary fence moved 2 meters inside private survey plot.",
            "category": "BOUNDARY_DISPUTE",
            "survey_number": "142/3A",
            "village": "Mylapore",
            "taluk": "Mylapore",
            "district": "Chennai",
            "priority": "High"
        },
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "DSP-TN-" in data["case_number"]

def test_security_active_sessions_and_feature_access(citizen_token):
    headers = {"Authorization": f"Bearer {citizen_token}"}
    res = client.get("/api/v1/security/feature-access", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["user_role"] == "CITIZEN"
    assert len(data["features"]) > 0
