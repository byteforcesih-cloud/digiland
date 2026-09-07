# DigiLand – AI-Powered Digital Land Record Management System

DigiLand is a comprehensive, production-grade full-stack web application designed for **Visual Studio Code** that digitizes, manages, verifies, and analyzes land records and cadastral deeds for both **Citizens** and **Government Officers (Tahsildar / Sub-Divisional Magistrates)**.

Built with **React 18 + Vite + Tailwind CSS** on the frontend, **Python FastAPI + SQLAlchemy + Pydantic v2** on the backend, and **PostgreSQL** relational database integration.

---

## 🏛️ System Architecture

```
digiland/
├── frontend/                     # React 18 + Vite + Tailwind CSS + TypeScript
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, SplitScreenVerifier, GISMap, AIAssistantChatbot
│   │   ├── context/              # AuthContext, LanguageContext (i18n), NotificationContext
│   │   ├── i18n/                 # Dictionaries: English, Tamil, Hindi, Telugu, Kannada, Malayalam
│   │   ├── pages/
│   │   │   ├── auth/             # Login, Register (Age 18+ check, Aadhaar check), ForgotPassword
│   │   │   ├── citizen/          # Dashboard, MyDocs, Upload, Scan, Update, Download, GIS, Search, Status
│   │   │   └── officer/          # Dashboard, Verification, OCRReview, Validation, Duplicates, GIS, Audit
│   │   ├── services/             # Axios API Client & Services
│   │   └── types/                # TypeScript Interfaces & Types
├── backend/                      # Python FastAPI REST API Backend
│   ├── app/
│   │   ├── api/v1/endpoints/     # Auth, Documents, Verification, Validation, Duplicate, GIS, Audit, Chatbot
│   │   ├── core/                 # Config, JWT Auth, Bcrypt, AES-256 GCM encryption, Audit Logging
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

## 🚀 Key Features

### 1. Dual User Portals (RBAC)
- **Citizen Portal**: Upload deeds, live scanner, version comparison diffs, land search across 9 fields, GIS parcel viewer, real-time stage tracker, watermarked certificate downloads.
- **Government Officer Portal**: District analytics, workload charts, split-screen verification workbench with document zoom/rotate and inline field editing, low-confidence OCR review queue, duplicate detection inspector, and full system audit logs.

### 2. AI OCR Digitization & Confidence Scoring
- Multi-format ingestion: **PDF, JPG, JPEG, PNG, Multi-page documents**.
- Structured extraction across 17 attributes:
  - Owner Name, Survey Number, Patta Number, Khasra Number, Khata Number, Plot Number, Land Area, Land Dimensions, Village, Taluk, District, State, Registration Date, Registration Office, Registration Officer, Previous Owner, Document Number.
- High-precision confidence scores with automatic **Requires Human Verification** warnings for confidence $< 75\%$.

### 3. Human-in-the-Loop Verification
- **Split-Screen Verification Interface**: Left side displays the original high-resolution scanned deed; Right side displays editable OCR fields, automated rule violations, duplicate flags, remarks, and decision buttons (`Approve`, `Reject`, `Request Correction`, `Flag Duplicate`).
- Immutable audit log generated for every officer modification and judgment.

### 4. Automated Data Validation & Duplicate Detection
- Rule validator checking: Missing survey number, format mismatch, area discrepancies, owner mismatches, and village/district consistency.
- Duplicate detection engine comparing 7 weighted identifiers to detect double conveyance or fraudulent registrations.

### 5. Cadastre GIS Mapping & Spatial Search
- Interactive Leaflet map rendering parcel boundary polygons, satellite ortho imagery, zoning classifications (Agricultural, Residential, Commercial, Industrial), and coordinate lookups.

### 6. Multi-Language Support (i18n)
- Seamless real-time bilingual switching across 6 languages: **English, தமிழ் (Tamil), हिन्दी (Hindi), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam)**.

### 7. AI Land Records Assistant Chatbot
- Floating AI assistant providing guidance on Patta, Chitta, Khasra, Khata, Survey Numbers, and verification processes with strict legal disclaimers.

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email / Login | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@digiland.gov.in` | `Citizen@123` | Upload deeds, track verification, update versions, GIS search |
| **Government Officer** | `officer@digiland.gov.in` | `Officer@123` | Split-screen verification, edit OCR fields, resolve duplicates, audit logs |

---

## ⚙️ Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL (Optional: SQLite auto-fallback enabled for zero-config local testing)

---

### 1. Backend Setup

```bash
cd digiland/backend

# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Start FastAPI server (Auto-initializes tables and seeds demo records)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Swagger API Documentation: `http://127.0.0.1:8000/docs`
- Redoc API Documentation: `http://127.0.0.1:8000/redoc`

---

### 2. Frontend Setup

```bash
cd digiland/frontend

# 1. Install npm dependencies
npm install

# 2. Start Vite development server
npm run dev
```

- Application Web UI: `http://localhost:5173`

---

### 3. Running Automated Tests

```bash
cd digiland/backend
python -m pytest -v tests/test_api.py
```

---

## 🗄️ PostgreSQL Database Schema

To initialize directly on PostgreSQL:

```bash
# Create database
createdb digiland_db

# Run DDL schema and initial seed
psql -d digiland_db -f ../database/schema.sql
psql -d digiland_db -f ../database/seed.sql
```

The database includes 15 interconnected relational tables:
`users`, `government_officers`, `roles`, `permissions`, `role_permissions`, `documents`, `document_versions`, `land_records`, `extracted_fields`, `ocr_results`, `validation_results`, `verification_records`, `duplicate_records`, `audit_logs`, `notifications`, `gis_data`, `password_reset_tokens`.

---

## 🛡️ Security Architecture

See detailed specifications in [`docs/SECURITY_ARCHITECTURE.md`](file:///docs/SECURITY_ARCHITECTURE.md):
- **AES-256-GCM** authenticated encryption for sensitive PII.
- **SHA-256 Hashing & Masking** for Aadhaar numbers (`XXXX-XXXX-4819`).
- **ModSecurity v3 + OWASP Core Rule Set (CRS)** reverse proxy configuration.
- **OWASP ZAP** DAST scanning workflows.
- **OpenVAS / Greenbone** vulnerability management.
