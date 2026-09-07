-- ==============================================================================
-- DigiLand: AI-Powered Digital Land Record Management System
-- PostgreSQL Database Schema
-- Compatible with PostgreSQL 13+
-- ==============================================================================

-- Enable UUID and Cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if re-initializing (in reverse dependency order)
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS gis_data CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS duplicate_records CASCADE;
DROP TABLE IF EXISTS verification_records CASCADE;
DROP TABLE IF EXISTS validation_results CASCADE;
DROP TABLE IF EXISTS ocr_results CASCADE;
DROP TABLE IF EXISTS extracted_fields CASCADE;
DROP TABLE IF EXISTS land_records CASCADE;
DROP TABLE IF EXISTS document_versions CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS government_officers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------------------------------------------
-- 1. ROLES & PERMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ------------------------------------------------------------------------------
-- 2. USERS (Citizens and Base Accounts)
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18),
    aadhaar_hash VARCHAR(128) NOT NULL, -- Stored securely as SHA-256 / encrypted hash
    aadhaar_masked VARCHAR(20) NOT NULL, -- e.g. "XXXX-XXXX-1234"
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'GOVERNMENT_OFFICER', 'ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta', 'hi', 'te', 'kn', 'ml')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- ------------------------------------------------------------------------------
-- 3. GOVERNMENT OFFICERS (Extended profile for verified officers)
-- ------------------------------------------------------------------------------
CREATE TABLE government_officers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    officer_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. "REV-TN-CHE-094"
    badge_number VARCHAR(50) NOT NULL,
    designation VARCHAR(100) NOT NULL, -- e.g. "Tahsildar / Village Administrative Officer (VAO)"
    department VARCHAR(100) NOT NULL DEFAULT 'Revenue & Land Administration',
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    jurisdiction_scope TEXT, -- JSON / comma-separated villages or codes
    is_authorized BOOLEAN DEFAULT TRUE,
    total_verifications_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gov_officers_district_taluk ON government_officers(district, taluk);

-- ------------------------------------------------------------------------------
-- 4. DOCUMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    document_number VARCHAR(100) NOT NULL, -- Deed / Patta reference no.
    title VARCHAR(200) NOT NULL,
    document_type VARCHAR(50) NOT NULL DEFAULT 'PATTA_CHITTA' 
        CHECK (document_type IN ('PATTA_CHITTA', 'SALE_DEED', 'KHASRA_KHATAUNI', 'GIFT_DEED', 'TITLE_DEED', 'ENCUMBRANCE_CERTIFICATE', 'MUTATION_RECORD', 'OTHER')),
    current_version INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING' 
        CHECK (status IN ('UPLOADED', 'PROCESSING', 'VERIFIED', 'VERIFICATION_REQUIRED', 'REJECTED', 'PENDING', 'DUPLICATE_SUSPECTED', 'POTENTIALLY_ALTERED', 'UNABLE_TO_VERIFY')),
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- e.g. "application/pdf", "image/jpeg"
    file_size INTEGER NOT NULL, -- bytes
    original_filename VARCHAR(255) NOT NULL,
    thumbnail_path VARCHAR(500),
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_doc_number ON documents(document_number);

-- ------------------------------------------------------------------------------
-- 5. DOCUMENT VERSIONS (For document update & historical diffs)
-- ------------------------------------------------------------------------------
CREATE TABLE document_versions (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_hash VARCHAR(128) NOT NULL, -- SHA-256 checksum
    uploaded_by INTEGER REFERENCES users(id),
    change_summary TEXT,
    diff_detected BOOLEAN DEFAULT FALSE,
    diff_details JSONB,
    officer_review_needed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_doc_versions_doc_id ON document_versions(document_id);

-- ------------------------------------------------------------------------------
-- 6. LAND RECORDS (Core structured land parcel record)
-- ------------------------------------------------------------------------------
CREATE TABLE land_records (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    owner_name VARCHAR(200) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    patta_number VARCHAR(100),
    khasra_number VARCHAR(100),
    khata_number VARCHAR(100),
    plot_number VARCHAR(100),
    land_area NUMERIC(12, 4) NOT NULL,
    area_unit VARCHAR(30) DEFAULT 'Sq.Ft' CHECK (area_unit IN ('Sq.Ft', 'Acres', 'Hectares', 'Sq.Meters', 'Guntas', 'Cents')),
    land_dimensions VARCHAR(200), -- e.g. "North: 60ft, South: 60ft, East: 40ft, West: 40ft"
    village VARCHAR(150) NOT NULL,
    taluk VARCHAR(150) NOT NULL,
    district VARCHAR(150) NOT NULL,
    state VARCHAR(150) NOT NULL DEFAULT 'Tamil Nadu',
    registration_date DATE,
    registration_office VARCHAR(200),
    registration_officer VARCHAR(150),
    previous_owner VARCHAR(200),
    status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_records_survey_patta ON land_records(survey_number, patta_number);
CREATE INDEX idx_land_records_location ON land_records(district, taluk, village);
CREATE INDEX idx_land_records_owner ON land_records(owner_name);

-- ------------------------------------------------------------------------------
-- 7. OCR RESULTS & EXTRACTED FIELDS
-- ------------------------------------------------------------------------------
CREATE TABLE ocr_results (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    raw_text TEXT,
    engine_used VARCHAR(50) DEFAULT 'DIGILAND_OCR_v2_NEURAL',
    processing_time_ms INTEGER,
    overall_confidence NUMERIC(5, 2) DEFAULT 88.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE extracted_fields (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(150) NOT NULL,
    field_value TEXT,
    confidence_score NUMERIC(5, 2) NOT NULL, -- 0.00 to 100.00
    requires_human_verification BOOLEAN DEFAULT FALSE,
    bounding_box JSONB, -- Coordinates: { "x": 100, "y": 200, "width": 150, "height": 30, "page": 1 }
    is_modified_by_officer BOOLEAN DEFAULT FALSE,
    officer_modified_value TEXT,
    officer_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extracted_fields_doc ON extracted_fields(document_id);

-- ------------------------------------------------------------------------------
-- 8. DATA VALIDATION RESULTS
-- ------------------------------------------------------------------------------
CREATE TABLE validation_results (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'NEEDS_REVIEW' 
        CHECK (status IN ('VALID', 'NEEDS_REVIEW', 'INVALID', 'VERIFICATION_PENDING')),
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    validation_rules_passed INTEGER DEFAULT 0,
    validation_rules_total INTEGER DEFAULT 10,
    mismatch_details JSONB, -- Array of issues detected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 9. DUPLICATE RECORDS DETECTION
-- ------------------------------------------------------------------------------
CREATE TABLE duplicate_records (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    matched_document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    similarity_score NUMERIC(5, 2) NOT NULL,
    matched_fields JSONB, -- e.g. ["survey_number", "village", "owner_name"]
    status VARCHAR(50) DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'UNDER_INVESTIGATION', 'DISMISSED', 'CONFIRMED_FRAUD')),
    resolved_by INTEGER REFERENCES users(id),
    resolution_remarks TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 10. VERIFICATION RECORDS (Human-in-the-Loop Officer Actions)
-- ------------------------------------------------------------------------------
CREATE TABLE verification_records (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    officer_id INTEGER REFERENCES users(id),
    verification_status VARCHAR(50) NOT NULL 
        CHECK (verification_status IN ('VERIFIED', 'VERIFICATION_REQUIRED', 'REJECTED', 'PENDING', 'DUPLICATE_SUSPECTED', 'POTENTIALLY_ALTERED', 'UNABLE_TO_VERIFY', 'CORRECTION_REQUESTED')),
    remarks TEXT,
    correction_instructions TEXT,
    field_adjustments JSONB,
    verification_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_records_doc ON verification_records(document_id);
CREATE INDEX idx_verification_records_officer ON verification_records(officer_id);

-- ------------------------------------------------------------------------------
-- 11. GIS DATA (Spatial & Parcel Coordinates)
-- ------------------------------------------------------------------------------
CREATE TABLE gis_data (
    id SERIAL PRIMARY KEY,
    land_record_id INTEGER REFERENCES land_records(id) ON DELETE CASCADE,
    survey_number VARCHAR(100) NOT NULL,
    patta_number VARCHAR(100),
    village VARCHAR(150) NOT NULL,
    taluk VARCHAR(150) NOT NULL,
    district VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    boundary_polygon_geojson JSONB NOT NULL,
    area_sqft NUMERIC(12, 2) NOT NULL,
    zone_type VARCHAR(100) DEFAULT 'Agricultural' CHECK (zone_type IN ('Agricultural', 'Residential', 'Commercial', 'Industrial', 'Special Economic Zone', 'Government Reserve')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gis_location ON gis_data(district, taluk, village);

-- ------------------------------------------------------------------------------
-- 12. AUDIT LOGS (Immutable Security and Activity Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(150),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL, -- e.g. "DOCUMENT_UPLOAD", "OCR_EXTRACT", "OFFICER_FIELD_CORRECT", "RECORD_APPROVED", "LOGIN_SUCCESS"
    entity_type VARCHAR(100) NOT NULL, -- e.g. "DOCUMENT", "LAND_RECORD", "USER", "VERIFICATION"
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ------------------------------------------------------------------------------
-- 13. NOTIFICATIONS (In-App, SMS, Email Dispatch Records)
-- ------------------------------------------------------------------------------
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL 
        CHECK (notification_type IN ('DOCUMENT_UPLOADED', 'PROCESSING_COMPLETED', 'VERIFICATION_REQUIRED', 'DOCUMENT_APPROVED', 'DOCUMENT_REJECTED', 'CORRECTION_REQUESTED', 'DUPLICATE_DETECTED', 'VALIDATION_ERROR', 'SYSTEM_ALERT')),
    is_read BOOLEAN DEFAULT FALSE,
    reference_type VARCHAR(50), -- e.g. "DOCUMENT"
    reference_id INTEGER,
    channel VARCHAR(30) DEFAULT 'IN_APP' CHECK (channel IN ('IN_APP', 'SMS_MOCK', 'EMAIL_MOCK', 'ALL')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);

-- ------------------------------------------------------------------------------
-- 14. PASSWORD RESET TOKENS
-- ------------------------------------------------------------------------------
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 15. INITIAL ROLES AND PERMISSION DATA
-- ------------------------------------------------------------------------------
INSERT INTO roles (name, description) VALUES 
('CITIZEN', 'Citizen user with rights to upload, view, manage, and track personal land records'),
('GOVERNMENT_OFFICER', 'Authorized land registry officer with rights to inspect, verify, edit, approve, and audit records'),
('ADMIN', 'Platform administrator with system configuration and security monitoring access');

INSERT INTO permissions (code, module, description) VALUES
('DOC_UPLOAD', 'DOCUMENT', 'Upload scanned land documents'),
('DOC_VIEW_OWN', 'DOCUMENT', 'View citizen owned documents'),
('DOC_VIEW_ALL', 'DOCUMENT', 'View all documents within jurisdiction'),
('DOC_VERIFY', 'VERIFICATION', 'Approve, reject, or request correction on documents'),
('OCR_EDIT', 'OCR', 'Modify OCR extracted values during verification'),
('GIS_VIEW', 'GIS', 'View spatial land parcels and coordinates'),
('AUDIT_VIEW', 'AUDIT', 'View audit trail logs');
