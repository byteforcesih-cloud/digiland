# DigiLand – AI-Powered Digital Land Record Management System

## Project Overview

**DigiLand** is a complete, full-stack digital land record management application created in Visual Studio Code. It bridges artificial intelligence (OCR field parsing, confidence scoring, duplicate detection) with human-in-the-loop governance (Tahsildar verification split workbench, immutable audit logging) and spatial GIS mapping.

---

## What Was Built

```
digiland/
├── frontend/                     # React 18 + Vite + Tailwind CSS + TypeScript + Leaflet
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, SplitScreenVerifier, GISMap, AIAssistantChatbot
│   │   ├── context/              # AuthContext, LanguageContext (i18n), NotificationContext
│   │   ├── i18n/                 # Dictionaries (EN, TA, HI, TE, KN, ML)
│   │   ├── pages/
│   │   │   ├── auth/             # Login, Register, ForgotPassword
│   │   │   ├── citizen/          # 12 Complete Citizen Pages
│   │   │   └── officer/          # 8 Complete Government Officer Pages
│   │   ├── services/             # Axios API Client & Services
│   │   └── types/                # TypeScript Data Interfaces
├── backend/                      # Python FastAPI REST API Backend
│   ├── app/
│   │   ├── api/v1/endpoints/     # Auth, Documents, Verification, Validation, Duplicate, GIS, Audit, Chatbot
│   │   ├── core/                 # Config, JWT Security, AES-256 GCM Encryption, Audit Logging
│   │   ├── db/                   # Session, Base, Seed Data, Auto Initializer
│   │   ├── models/               # 15 PostgreSQL/SQLAlchemy ORM Entities
│   │   ├── schemas/              # Pydantic v2 validation schemas
│   │   ├── services/             # OCR engine, Validation rule engine, Duplicate matcher, GIS, Notifications
│   │   └── main.py               # FastAPI App entrypoint, CORS, Static Uploads
│   ├── tests/                    # Pytest Integration & Unit Tests
│   └── requirements.txt
├── database/
│   ├── schema.sql                # PostgreSQL 15 DDL with foreign keys, indexes, and triggers
│   └── seed.sql                  # Comprehensive demo data SQL
├── uploads/                      # Storage for uploaded deeds, PDFs, and thumbnails
├── docs/
│   └── SECURITY_ARCHITECTURE.md  # ModSecurity, OWASP CRS, ZAP, OpenVAS & AES-256 Architecture
├── .vscode/                      # VS Code debug configs (launch.json, tasks.json)
├── .env.example
└── README.md
```

---

## Verification & Test Results

### 1. Backend Automated Integration Tests (Pytest)
Command run: `python -m pytest -v tests/test_api.py`

| Test Case | Module | Description | Result |
| :--- | :--- | :--- | :--- |
| `test_health_check` | Health | Verifies `/health` endpoint and operational status | **PASSED** ✅ |
| `test_citizen_login` | Auth | Verifies citizen JWT token issuance and role claims | **PASSED** ✅ |
| `test_officer_login` | Auth | Verifies government officer JWT token issuance | **PASSED** ✅ |
| `test_citizen_registration_validation` | Auth | Enforces age $\ge 18$, password matching, and Aadhaar checks | **PASSED** ✅ |
| `test_document_upload_and_ocr` | Documents | PDF upload, OCR extraction of 17 fields, and confidence scores | **PASSED** ✅ |
| `test_gis_parcels_and_search` | GIS | Spatial boundary polygon retrieval and multi-field land search | **PASSED** ✅ |
| `test_officer_verification_workflow` | Verification | Split-screen review, field adjustment, and approval decision | **PASSED** ✅ |
| `test_chatbot_assistant` | AI Assistant | Knowledge queries for Patta, Survey Numbers, and legal disclaimer | **PASSED** ✅ |

**Summary: 8 passed in 3.04s (100% test pass rate)**

---

### 2. Frontend Build Verification (TypeScript & Vite)
Command run: `npm.cmd run build` inside `digiland/frontend`

```
vite v5.4.21 building for production...
✓ 1628 modules transformed.
dist/index.html                   1.30 kB
dist/assets/index-CTFsrUB2.css   40.21 kB
dist/assets/index-ChQ9LadF.js   558.65 kB
✓ built in 4.57s
```

**Summary: Clean build with 0 TypeScript or bundling errors.**

---

## Core Feature Highlights

### 1. Dual User Roles & Workspaces
- **Citizen Portal**:
  - Registration with age validation ($\ge 18$), 12-digit mock Aadhaar verification, and masked Aadhaar storage (`XXXX-XXXX-4819`).
  - [CitizenDashboard.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/CitizenDashboard.tsx): Total documents, processing, verified records, pending verification, recent documents table, and verification progress tracker.
  - [UploadDocument.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/UploadDocument.tsx) & [ScanDocument.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/ScanDocument.tsx): Multi-page PDF/image uploads, live camera scanner simulation, and instant OCR field extraction.
  - [UpdateDocument.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/UpdateDocument.tsx): Automated version comparison, difference detector, and automatic routing to Tahsildar if significant variances detected.
  - [DownloadDocument.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/DownloadDocument.tsx): Downloads watermarked, digitally verified official PDF Land Record Verification Certificates.
  - [LandSearch.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/LandSearch.tsx) & [GISMap.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/GISMap.tsx): Spatial cadastre search and Leaflet polygon parcel explorer.
  - [VerificationStatus.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/VerificationStatus.tsx): 5-stage lifecycle tracker with governance notice.
  - [Notifications.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/Notifications.tsx), [Profile.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/Profile.tsx), and [AuditHistory.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/citizen/AuditHistory.tsx).

- **Government Officer Portal**:
  - [OfficerDashboard.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/officer/OfficerDashboard.tsx): Summary counters, district-wise progress charts, timeline trends, error statistics, and active queue.
  - [DocumentVerification.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/officer/DocumentVerification.tsx) & [SplitScreenVerifier.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/components/verification/SplitScreenVerifier.tsx):
    - **Left Side**: Original scanned deed preview with Zoom in/out, Rotate, and Download controls.
    - **Right Side**: Extracted fields with AI confidence scores, inline field correction inputs, automated validation discrepancy flags, duplicate match alerts, remarks textarea, correction instructions, and decision buttons (`Approve`, `Reject`, `Request Correction`, `Flag Duplicate`).
  - [OCRReview.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/officer/OCRReview.tsx): Low-confidence queue with "Requires Human Verification" warning tags.
  - [DataValidation.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/officer/DataValidation.tsx): Automated rule engine results.
  - [DuplicateDetection.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/officer/DuplicateDetection.tsx): Side-by-side comparison of duplicate candidates with similarity scores and resolution actions.
  - [OfficerGISMap.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/officer/OfficerGISMap.tsx) & [AuditLogs.tsx](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/pages/officer/AuditLogs.tsx).

### 2. Multi-Language Support (i18n)
Full support across 6 languages in [`translations.ts`](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/i18n/translations.ts):
- **English (`en`)**
- **தமிழ் / Tamil (`ta`)**
- **हिन्दी / Hindi (`hi`)**
- **తెలుగు / Telugu (`te`)**
- **ಕನ್ನಡ / Kannada (`kn`)**
- **മലയാളം / Malayalam (`ml`)**

### 3. AI Assistant Chatbot
Floating widget in [`AIAssistantChatbot.tsx`](file:///C:/Users/Haribabu/.gemini/antigravity/scratch/digiland/frontend/src/components/chat/AIAssistantChatbot.tsx) assisting users with Patta, Survey Numbers, Khasra/Khata, and verification procedures with clear legal disclaimers.

---

## How to Run in VS Code

### 1. Start Backend

```bash
cd digiland/backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Docs: `http://127.0.0.1:8000/docs`

### 2. Start Frontend

```bash
cd digiland/frontend
npm run dev
```
- Web Application: `http://localhost:5173`

### 3. Pre-Configured Demo Credentials

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Citizen Demo** | `citizen@digiland.gov.in` | `Citizen@123` |
| **Tahsildar / Officer Demo** | `officer@digiland.gov.in` | `Officer@123` |
