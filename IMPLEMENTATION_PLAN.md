# DigiLand – AI-Powered Digital Land Record Management System Implementation Plan

DigiLand is a production-grade full-stack digital land record management platform designed for Citizens and Government Officers. It incorporates AI-assisted document digitization, OCR with confidence evaluation, automatic data validation, duplicate detection, human-in-the-loop verification with split-screen document review, GIS parcel mapping, multi-language support (English, Tamil, Hindi, Telugu, Kannada, Malayalam), and complete role-based audit logging.

## Proposed Architecture

```
digiland/
├── frontend/                     # React 18 + Vite + Tailwind CSS + Lucide Icons + Leaflet
│   ├── src/
│   │   ├── components/           # UI widgets, SplitScreenVerifier, Dropzone, GIS Map, Chatbot
│   │   ├── context/              # AuthContext, LanguageContext, NotificationContext
│   │   ├── i18n/                 # Dictionaries (EN, TA, HI, TE, KN, ML)
│   │   ├── pages/                # Citizen & Officer pages
│   │   ├── services/             # Axios API client & endpoints
│   │   └── types/                # TypeScript data interfaces
├── backend/                      # Python 3.10+ FastAPI REST Backend
│   ├── app/
│   │   ├── api/v1/endpoints/     # Auth, Documents, OCR, Verification, Validation, GIS, Audit, Chatbot
│   │   ├── core/                 # Config, JWT Security, AES-256 encryption, Auditing
│   │   ├── db/                   # Session, SQLAlchemy Base, Seed data
│   │   ├── models/               # 15 PostgreSQL/SQLAlchemy ORM Entities
│   │   ├── schemas/              # Pydantic v2 schemas
│   │   ├── services/             # OCR engine, Validation rule engine, Duplicate matcher, GIS, Notifications
│   │   └── main.py               # FastAPI application setup & CORS
├── database/
│   ├── schema.sql                # Pure PostgreSQL DDL with indexes, constraints & triggers
│   └── seed.sql                  # Comprehensive demo data SQL
├── uploads/                      # Secure storage for land documents and preview assets
└── .vscode/                      # VS Code debug configs (launch.json, tasks.json)
```

---

## User Review Required

> [!IMPORTANT]
> **Database Compatibility**: The system is built with native PostgreSQL schema definitions and SQLAlchemy ORM. It supports running against a PostgreSQL instance as specified, with automatic fallback configuration for SQLite for instant out-of-the-box local testing in VS Code if PostgreSQL service is not immediately running on the host.

> [!NOTE]
> **OCR and External Services**: As per specifications, OCR and Mock Verification APIs (Aadhaar/Phone OTP, SMS/Email) are designed with clean modular interfaces. PyTesseract / computer vision fallbacks and structured mock extraction simulate real Indian land deed formats (Tamil Nadu Patta/Chitta, Karnataka Bhoomi, Telangana Dharani, UP/MP Khasra-Khata format) with realistic field confidence scoring.

---

## Proposed Changes

### 1. Database & Schema Layer

#### [NEW] `database/schema.sql`
- Standard PostgreSQL DDL creating 15 tables: `users`, `government_officers`, `roles`, `permissions`, `role_permissions`, `documents`, `document_versions`, `land_records`, `extracted_fields`, `ocr_results`, `validation_results`, `verification_records`, `duplicate_records`, `audit_logs`, `notifications`, `gis_data`, and `password_reset_tokens`.
- Foreign key constraints, cascade rules, indexing on `survey_number`, `patta_number`, `aadhaar_hash`, `email`, `document_number`.

#### [NEW] `database/seed.sql`
- Initial seed data for demo accounts:
  - Citizen: `citizen@digiland.gov.in` / `Citizen@123`
  - Officer: `officer@digiland.gov.in` / `Officer@123`
  - Sample land records (Patta No 4521, Survey 142/3A in Coimbatore, Chennai, Bangalore, Hyderabad), GIS coordinates & GeoJSON boundary polygons, mock audit logs and notifications.

---

### 2. Backend (FastAPI + SQLAlchemy + Pydantic)

#### [NEW] `backend/app/core/config.py` & `security.py`
- Pydantic Settings reading `.env`.
- Password hashing with bcrypt, JWT token generation & role claim enforcement.
- AES-256 field encryption helper for sensitive data storage (e.g. Aadhaar masking and encryption).
- Audit logger helper recording user id, IP, action, entity, and diff details.

#### [NEW] `backend/app/models/`
- `user.py`: `User`, `GovernmentOfficer`, `Role`, `Permission`, `PasswordResetToken`
- `document.py`: `Document`, `DocumentVersion`, `ExtractedField`, `OCRResult`
- `land.py`: `LandRecord`, `GISData`
- `verification.py`: `VerificationRecord`, `ValidationResult`, `DuplicateRecord`
- `audit.py`: `AuditLog`
- `notification.py`: `Notification`, `MockMessageLog`

#### [NEW] `backend/app/services/`
- `ocr_service.py`: Multi-format extractor (PDF, JPG, PNG) supporting field parsing (Owner, Survey No, Patta, Khasra, Khata, Plot, Area, Dimensions, Village, Taluk, District, State, Registration Date/Officer) with realistic confidence scores and low-confidence flags (`Requires Human Verification`).
- `validation_service.py`: Automated rule engine checking missing survey numbers, format mismatches, area discrepancies, owner mismatches, and village/district consistency.
- `duplicate_service.py`: Similarity matching across survey numbers, patta numbers, owner names, and land areas to trigger `Potential Duplicate Record Detected` alerts.
- `gis_service.py`: GeoJSON spatial parcel engine with bounding boxes and demo land coordinate sets.
- `notification_service.py`: In-app notification creation with mock SMS and Email dispatch logging.
- `chatbot_service.py`: AI Land Assistant responding to citizen inquiries about land terminology (Patta, Chitta, Khasra, Survey No), upload guidelines, and verification tracking with strict legal disclaimers.

#### [NEW] `backend/app/api/v1/endpoints/`
- `auth.py`: Registration with validation (Age >= 18, Aadhaar & Phone mock check, passwords match), Login returning JWT + role, Forgot/Reset Password, `/me` profile.
- `documents.py`: Upload (PDF/JPG/PNG), list user documents, get document details, update document version with automatic diff detection, download verified certificates with watermark.
- `verification.py`: Officer verification queue, split-screen review endpoint, submit officer decision (Approve, Reject, Request Correction, Edit extracted fields, Add remarks).
- `validation.py` & `duplicate.py`: Endpoints for inspection of validation rules and duplicate match queues.
- `gis.py`: Spatial query and land search by survey number, patta, khasra, owner, district.
- `analytics.py`: Officer dashboard stats (district-wise progress, verification status charts, error statistics).
- `audit.py` & `notifications.py`: Audit history and notification center endpoints.
- `chatbot.py`: Chatbot message processing.

---

### 3. Frontend (React + Vite + Tailwind CSS + TypeScript)

#### [NEW] `frontend/src/context/` & `services/`
- `AuthContext.tsx`: Manages user login state, JWT token storage, role-based route guards (`CitizenRoute`, `OfficerRoute`).
- `LanguageContext.tsx`: Provides multi-language strings (EN, TA, HI, TE, KN, ML).
- `NotificationContext.tsx`: Real-time notification badge and polling/toast alerts.
- `api.ts`: Configured Axios client with bearer token interceptor and error handlers.

#### [NEW] `frontend/src/components/`
- `Navbar.tsx` & `Sidebar.tsx`: Government-style header with National Emblem/DigiLand insignia, role indicators, language selector, notification bell, profile dropdown.
- `DropzoneUpload.tsx`: Multi-format drag-and-drop document uploader with live progress and file type validation.
- `SplitScreenVerifier.tsx`: Interactive verification workbench for officers (Left: document preview with zoom/rotate; Right: editable extracted fields with confidence badges, remarks, and approval actions).
- `GISParcelMap.tsx`: Interactive Leaflet map displaying parcel polygon boundaries, satellite/street tile layers, and parcel metadata popups.
- `AIAssistantChatbot.tsx`: Floating AI chatbot widget providing interactive land record help.
- `StatCard.tsx`, `Badge.tsx`, `DataTable.tsx`, `AuditTimeline.tsx`.

#### [NEW] `frontend/src/pages/`
- **Auth**: `Login.tsx`, `Register.tsx`, `ForgotPassword.tsx`
- **Citizen Pages**:
  - `CitizenDashboard.tsx`: Metrics, recent documents, verification progress, quick actions.
  - `MyDocuments.tsx`: Table and card view of citizen's land deeds with status tags.
  - `UploadDocument.tsx`: Document upload and instant OCR extraction inspection.
  - `ScanDocument.tsx`: Scanned document capture workflow.
  - `UpdateDocument.tsx`: Document version update with visual diff detection against previous version.
  - `DownloadDocument.tsx`: Verified Land Record Certificate generator with official QR code/watermark.
  - `LandSearch.tsx`: Multi-field land record search (Owner, Survey, Patta, Khasra, Village).
  - `GISMap.tsx`: Citizen GIS parcel view and land location explorer.
  - `VerificationStatus.tsx`: Real-time tracking of officer review stages.
  - `Notifications.tsx`, `Profile.tsx`, `AuditHistory.tsx`.
- **Government Officer Pages**:
  - `OfficerDashboard.tsx`: Officer metrics, District-wise progress charts, processing trends, error analytics.
  - `CitizenRecords.tsx`: Search and inspect citizen records by jurisdiction.
  - `DocumentVerification.tsx`: Verification list and one-click access to SplitScreenVerifier.
  - `OCRReview.tsx`: Queue of low-confidence documents requiring human review.
  - `DataValidation.tsx`: Overview of rule validation failures and format mismatches.
  - `DuplicateDetection.tsx`: Side-by-side comparison of duplicate candidates.
  - `OfficerGISMap.tsx`: Comprehensive district parcel map with land use zoning.
  - `AuditLogs.tsx`: Immutable system audit trail with user filter and action timestamps.

---

### 4. VS Code & Security Configuration

#### [NEW] `.vscode/launch.json` & `.vscode/tasks.json`
- One-click launch configurations for FastAPI backend and React frontend.

#### [NEW] `docs/SECURITY_ARCHITECTURE.md`
- Documentation for ModSecurity + OWASP Core Rule Set (CRS) integration, OWASP ZAP dynamic scanning procedures, OpenVAS vulnerability management, and AES-256 data protection guidelines.

---

## Verification Plan

### Automated Tests
1. **Backend Integration & Unit Tests**:
   - `test_auth.py`: Registration validations (Age >= 18, duplicate email/Aadhaar handling), JWT token generation, role verification.
   - `test_documents.py`: File upload, OCR field extraction, version creation, confidence calculations.
   - `test_verification.py`: Officer approval/rejection/remarks workflows, audit log creation.
   - `test_validation_and_duplicate.py`: Rule mismatch detection and duplicate scoring engine.
2. **Frontend Build & Lint**:
   - `npm run build` to ensure TypeScript compilation without errors.

### Manual Verification
1. Citizen Flow: Register -> Login -> Upload land deed (PDF/JPG) -> Inspect extracted fields with confidence scores -> Check verification status -> Test version update diff -> Test AI chatbot -> Search land on GIS Map.
2. Officer Flow: Login -> Review dashboard charts -> Open SplitScreenVerifier -> Edit low-confidence field -> Add officer remarks -> Approve/Reject record -> Check Duplicate detection queue -> Verify audit logs record every action.
