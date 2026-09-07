import pytest
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_citizen_login():
    response = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "citizen@digiland.gov.in", "password": "Citizen@123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "CITIZEN"
    assert data["full_name"] == "Ramasamy Subramanian"

def test_officer_login():
    response = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "officer@digiland.gov.in", "password": "Officer@123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "GOVERNMENT_OFFICER"

def test_citizen_registration_validation():
    # Test age under 18 rejection
    underage_payload = {
        "full_name": "Minor User",
        "email": "minor@example.com",
        "phone": "9988776655",
        "age": 16,
        "aadhaar_number": "112233445566",
        "password": "Password@123",
        "confirm_password": "Password@123"
    }
    # Test direct valid registration without Aadhaar
    import uuid
    uid = uuid.uuid4().hex[:6]
    valid_payload = {
        "full_name": f"Direct Citizen {uid}",
        "email": f"direct_reg_{uid}@example.com",
        "phone": f"91{int(uuid.uuid4().int % 100000000):08d}",
        "age": 25,
        "password": "Password@123",
        "confirm_password": "Password@123"
    }
    res_valid = client.post("/api/v1/auth/register", json=valid_payload)
    assert res_valid.status_code == 201
    user_data = res_valid.json()
    assert user_data["email"] == valid_payload["email"]
    assert user_data["is_verified"] is True

def test_document_upload_and_ocr():
    # Login as citizen
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "citizen@digiland.gov.in", "password": "Citizen@123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Upload test scanned document
    file_content = b"%PDF-1.4 Mock Scanned Land Patta Chitta Record Extent 2400 Sq.Ft Survey 142/3A"
    files = {"file": ("patta_extract_chennai.pdf", file_content, "application/pdf")}
    data = {"document_type": "PATTA_CHITTA", "title": "Verified Land Deed Survey 142/3A"}

    upload_res = client.post("/api/v1/documents/upload", headers=headers, files=files, data=data)
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    assert "id" in doc_data
    assert "document_number" in doc_data
    assert len(doc_data["extracted_fields"]) > 0
    # Check that confidence scores are attached
    assert all("confidence_score" in f for f in doc_data["extracted_fields"])

def test_gis_parcels_and_search():
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "citizen@digiland.gov.in", "password": "Citizen@123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get GIS parcels
    parcels_res = client.get("/api/v1/gis/parcels?district=Chennai", headers=headers)
    assert parcels_res.status_code == 200
    parcels = parcels_res.json()
    assert len(parcels) > 0
    assert "boundary_polygon_geojson" in parcels[0]

    # Search land records
    search_res = client.get("/api/v1/gis/search?q=Mylapore", headers=headers)
    assert search_res.status_code == 200
    assert len(search_res.json()) > 0

def test_officer_verification_workflow():
    # Login as officer
    officer_login = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "officer@digiland.gov.in", "password": "Officer@123"}
    )
    token = officer_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch verification queue
    queue_res = client.get("/api/v1/verification/queue", headers=headers)
    assert queue_res.status_code == 200
    docs = queue_res.json()
    assert len(docs) > 0
    test_doc_id = docs[0]["id"]

    # Fetch split screen review data
    review_res = client.get(f"/api/v1/verification/review/{test_doc_id}", headers=headers)
    assert review_res.status_code == 200
    split_data = review_res.json()
    assert "document" in split_data
    assert "extracted_fields" in split_data

    # Submit officer decision
    submit_payload = {
        "document_id": test_doc_id,
        "decision": "APPROVE",
        "remarks": "Cross-verified with Mylapore Sub-Registrar Volume 412.",
        "field_adjustments": {"survey_number": "142/3A"}
    }
    ver_submit = client.post("/api/v1/verification/submit", headers=headers, json=submit_payload)
    assert ver_submit.status_code == 200
    assert ver_submit.json()["verification_status"] == "VERIFIED"

def test_chatbot_assistant():
    chat_payload = {"message": "What is a Patta Number and how is it verified?", "language": "en"}
    res = client.post("/api/v1/chatbot/chat", json=chat_payload)
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "disclaimer" in data
    assert "Patta" in data["reply"]
