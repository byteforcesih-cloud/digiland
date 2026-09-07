import pytest
import io
import os
from fastapi.testclient import TestClient
from app.main import app
from app.services.mock_aadhaar_service import mock_aadhaar_service
from app.services.password_pdf_service import password_pdf_service
from app.services.document_encryption_service import encryption_service
from app.services.scanner_service import scanner_service
from PIL import Image

client = TestClient(app)

@pytest.fixture(scope="module")
def citizen_auth_token():
    res = client.post("/api/v1/auth/login", json={"email_or_phone": "citizen@digiland.gov.in", "password": "Citizen@123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]

@pytest.fixture(scope="module")
def officer_auth_token():
    res = client.post("/api/v1/auth/login", json={"email_or_phone": "officer@digiland.gov.in", "password": "Officer@123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]

# 1. Test Mock Aadhaar Identity Verification
def test_mock_aadhaar_verification_flow(citizen_auth_token):
    headers = {"Authorization": f"Bearer {citizen_auth_token}"}
    
    # 1.1 Invalid Aadhaar (less than 12 digits)
    res_bad = client.post("/api/v1/identity/aadhaar/request-otp", json={"aadhaar_number": "12345"}, headers=headers)
    assert res_bad.status_code == 400
    
    # 1.2 Request OTP for valid demo Aadhaar
    res_req = client.post(
        "/api/v1/identity/aadhaar/request-otp",
        json={"aadhaar_number": "9901-2345-6789"},
        headers=headers
    )
    assert res_req.status_code == 200, f"OTP request failed: {res_req.text}"
    data = res_req.json()
    assert data["status"] == "OTP_SENT"
    assert "session_id" in data
    assert "demo_otp" in data
    
    session_id = data["session_id"]
    otp_code = data["demo_otp"]
    
    # 1.3 Incorrect OTP
    res_wrong = client.post(
        "/api/v1/identity/aadhaar/confirm-otp",
        json={"session_id": session_id, "otp_code": "000000"},
        headers=headers
    )
    assert res_wrong.status_code == 400
    
    # 1.4 Correct OTP confirmation
    res_confirm = client.post(
        "/api/v1/identity/aadhaar/confirm-otp",
        json={"session_id": session_id, "otp_code": otp_code},
        headers=headers
    )
    assert res_confirm.status_code == 200
    assert res_confirm.json()["status"] == "VERIFIED"
    assert res_confirm.json()["profile"]["full_name"] == "Ramasamy Subramanian"

# 2. Test Password-Protected PDF Derivation & Generation
def test_password_protected_pdf_service():
    pwd = password_pdf_service.derive_password("142/3A", "Ramasamy Subramanian")
    assert pwd == "1423ARAMASAMY"
    
    pdf_bytes, derived_pwd, hint = password_pdf_service.generate_protected_certificate(
        document_number="TN-DOC-TEST-001",
        title="Patta Extract",
        document_type="PATTA_CHITTA",
        status="VERIFIED",
        version=1,
        survey_number="142/3A",
        owner_name="Ramasamy Subramanian"
    )
    assert len(pdf_bytes) > 500
    assert derived_pwd == "1423ARAMASAMY"
    assert "1423ARAMASAMY" in hint

# 3. Test AES-256-GCM File Encryption & Decryption
def test_document_encryption_service():
    original_data = b"CONFIDENTIAL LAND REGISTRY DEED DATA 2026 CHENNAI"
    cipher, nonce_b64 = encryption_service.encrypt_bytes(original_data)
    assert cipher != original_data
    assert len(nonce_b64) > 0
    
    decrypted = encryption_service.decrypt_bytes(cipher, nonce_b64)
    assert decrypted == original_data

# 4. Test Location Hierarchy & Autocomplete
def test_location_hierarchy_and_suggestions():
    # States
    res_states = client.get("/api/v1/locations/states")
    assert res_states.status_code == 200
    assert "Tamil Nadu" in res_states.json()
    
    # Districts
    res_dist = client.get("/api/v1/locations/districts?state=Tamil Nadu")
    assert res_dist.status_code == 200
    assert "Chennai" in res_dist.json()
    
    # Taluks
    res_taluks = client.get("/api/v1/locations/taluks?district=Chennai&state=Tamil Nadu")
    assert res_taluks.status_code == 200
    assert "Mylapore" in res_taluks.json()
    
    # Autocomplete Suggestions
    res_sugg = client.get("/api/v1/locations/suggestions?q=Mylapore")
    assert res_sugg.status_code == 200
    assert isinstance(res_sugg.json(), list)

# 5. Test Risk-Based CAPTCHA Service
def test_captcha_challenge_and_verification():
    res_chal = client.get("/api/v1/captcha/challenge")
    assert res_chal.status_code == 200
    data = res_chal.json()
    assert "captcha_token" in data
    assert "question" in data
    
    # Attempt invalid answer
    res_bad = client.post(
        "/api/v1/captcha/verify",
        json={"captcha_token": data["captcha_token"], "user_answer": "wrong_ans"}
    )
    assert res_bad.status_code == 400

# 6. Test Image Quality Evaluation in Scanner
def test_scanner_quality_evaluation():
    # Create valid synthetic test image in memory
    img = Image.new("RGB", (800, 600), color=(200, 200, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()
    
    res = client.post(
        "/api/v1/scanner/evaluate-frame",
        files={"file": ("frame.jpg", img_bytes, "image/jpeg")}
    )
    assert res.status_code == 200
    assert "status" in res.json()

# 7. Test Personal Storage Upload & Usage
def test_personal_storage_vault(citizen_auth_token):
    headers = {"Authorization": f"Bearer {citizen_auth_token}"}
    
    # Check initial usage
    res_usage = client.get("/api/v1/storage/usage", headers=headers)
    assert res_usage.status_code == 200
    assert "quota_mb" in res_usage.json()
    
    # Upload test document
    doc_content = b"%PDF-1.4 Mock Personal Tax Receipt 2026"
    res_up = client.post(
        "/api/v1/storage/upload",
        data={"folder_category": "Tax Documents", "description": "Annual Land Tax Receipt"},
        files={"file": ("tax_receipt_2026.pdf", doc_content, "application/pdf")},
        headers=headers
    )
    assert res_up.status_code == 200, f"Upload failed: {res_up.text}"
    file_id = res_up.json()["id"]
    
    # List files
    res_list = client.get("/api/v1/storage/files?category=Tax Documents", headers=headers)
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1
    
    # Download file (decrypt on the fly)
    res_dl = client.get(f"/api/v1/storage/files/{file_id}/download", headers=headers)
    assert res_dl.status_code == 200
    assert res_dl.content == doc_content
    
    # Delete file
    res_del = client.delete(f"/api/v1/storage/files/{file_id}", headers=headers)
    assert res_del.status_code == 200

# 8. Test Context-Aware Chatbot
def test_chatbot_context_aware():
    res1 = client.post("/api/v1/chatbot/chat", json={"message": "How does mock Aadhaar verification work?"})
    assert res1.status_code == 200
    assert "Aadhaar" in res1.json()["reply"]
    
    res2 = client.post("/api/v1/chatbot/chat", json={"message": "What is the password for my downloaded PDF?"})
    assert res2.status_code == 200
    assert "Survey Number" in res2.json()["reply"]
