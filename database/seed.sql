-- ==============================================================================
-- DigiLand: Seed Data Script
-- Populates Demo Users, Officers, Land Records, Documents, Extracted Fields,
-- GIS Geometries, Notifications, and Audit Logs.
-- ==============================================================================

-- Password for both accounts below is: Pass123! (bcrypt hash: $2b$12$K8yR2uU4b5qV1w5JzR3LXe2uD7Y5.zEwV8N4A9c9tD5uG7H3p5N0K)
-- Also supported: Citizen@123 / Officer@123 handled in Python seeder as well.

-- 1. DEMO USERS
INSERT INTO users (id, full_name, email, phone, age, aadhaar_hash, aadhaar_masked, hashed_password, role, is_active, is_verified, preferred_language)
VALUES 
(1, 'Ramasamy Subramanian', 'citizen@digiland.gov.in', '9876543210', 42, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'XXXX-XXXX-4819', '$2b$12$0z3vQjG7oXUj8y0H4HhGxeZkP6B3b6zO4Jp2X3V6W7t0T1k4u7GzW', 'CITIZEN', TRUE, TRUE, 'en'),
(2, 'Dr. K. Ananthakrishnan, IAS', 'officer@digiland.gov.in', '9840123456', 48, 'a8b1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c966', 'XXXX-XXXX-9901', '$2b$12$0z3vQjG7oXUj8y0H4HhGxeZkP6B3b6zO4Jp2X3V6W7t0T1k4u7GzW', 'GOVERNMENT_OFFICER', TRUE, TRUE, 'en'),
(3, 'Smt. Lakshmi Narayanan', 'lakshmi.n@gmail.com', '9845112233', 36, 'b9c2c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852d123', 'XXXX-XXXX-7721', '$2b$12$0z3vQjG7oXUj8y0H4HhGxeZkP6B3b6zO4Jp2X3V6W7t0T1k4u7GzW', 'CITIZEN', TRUE, TRUE, 'ta')
ON CONFLICT (id) DO NOTHING;

-- 2. GOVERNMENT OFFICER PROFILE
INSERT INTO government_officers (id, user_id, officer_code, badge_number, designation, department, state, district, taluk, jurisdiction_scope, is_authorized, total_verifications_completed)
VALUES 
(1, 2, 'REV-TN-CHE-094', 'OFF-TN-8831', 'Tahsildar / Sub-Divisional Magistrate', 'Revenue & Land Administration', 'Tamil Nadu', 'Chennai', 'Mylapore', '["Mylapore", "Triplicane", "Alwarpet", "Mandaveli"]', TRUE, 142)
ON CONFLICT (id) DO NOTHING;

-- 3. DOCUMENTS
INSERT INTO documents (id, user_id, document_number, title, document_type, current_version, status, file_path, file_type, file_size, original_filename, thumbnail_path, is_locked)
VALUES 
(1, 1, 'DOC-TN-2024-8841', 'Patta / Chitta Extract - Survey 142/3A', 'PATTA_CHITTA', 1, 'VERIFIED', 'uploads/documents/sample_patta_142_3a.pdf', 'application/pdf', 1048576, 'sample_patta_142_3a.pdf', 'uploads/thumbnails/sample_patta_142_3a.png', FALSE),
(2, 1, 'DOC-TN-2025-9102', 'Sale Deed Conveyance - Plot 44B Mylapore', 'SALE_DEED', 2, 'VERIFICATION_REQUIRED', 'uploads/documents/sale_deed_plot_44b.pdf', 'application/pdf', 2097152, 'sale_deed_plot_44b.pdf', 'uploads/thumbnails/sale_deed_plot_44b.png', FALSE),
(3, 3, 'DOC-TN-2025-1049', 'Encumbrance Certificate - Alwarpet Property', 'ENCUMBRANCE_CERTIFICATE', 1, 'PENDING', 'uploads/documents/ec_cert_2025.pdf', 'application/pdf', 786432, 'ec_cert_2025.pdf', 'uploads/thumbnails/ec_cert_2025.png', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. DOCUMENT VERSIONS
INSERT INTO document_versions (id, document_id, version_number, file_path, file_hash, uploaded_by, change_summary, diff_detected, diff_details, officer_review_needed)
VALUES 
(1, 1, 1, 'uploads/documents/sample_patta_142_3a.pdf', '6a2df83f4b5c102a...', 1, 'Initial upload and OCR extraction of Patta document', FALSE, '{}', FALSE),
(2, 2, 1, 'uploads/documents/sale_deed_plot_44b_v1.pdf', '7b3ef94f5c6d203b...', 1, 'Initial registration deed', FALSE, '{}', FALSE),
(3, 2, 2, 'uploads/documents/sale_deed_plot_44b.pdf', '8c4fa05f6d7e304c...', 1, 'Updated partition schedule and boundary rectification', TRUE, '{"field_changed": "land_area", "old_val": "2400 Sq.Ft", "new_val": "2450 Sq.Ft", "reason": "Boundary survey adjustment"}', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. LAND RECORDS
INSERT INTO land_records (id, document_id, user_id, owner_name, survey_number, patta_number, khasra_number, khata_number, plot_number, land_area, area_unit, land_dimensions, village, taluk, district, state, registration_date, registration_office, registration_officer, previous_owner, status)
VALUES 
(1, 1, 1, 'Ramasamy Subramanian', '142/3A', 'PATTA-4521', 'KH-882', 'KT-104', 'Plot 12', 2400.00, 'Sq.Ft', 'North: 60ft, South: 60ft, East: 40ft, West: 40ft', 'Mylapore', 'Mylapore', 'Chennai', 'Tamil Nadu', '2023-04-15', 'Sub-Registrar Office, Mylapore', 'Thiru R. Venkatesh', 'K. S. Narayana Iyer', 'VERIFIED'),
(2, 2, 1, 'Ramasamy Subramanian', '189/2B', 'PATTA-6610', 'KH-914', 'KT-205', 'Plot 44B', 2450.00, 'Sq.Ft', 'North: 61ft, South: 61ft, East: 40ft, West: 40ft', 'Alwarpet', 'Mylapore', 'Chennai', 'Tamil Nadu', '2024-11-20', 'Sub-Registrar Office, Mylapore', 'Tmt. S. Gomathi', 'M/s Greenfield Realtors', 'PENDING_VERIFICATION'),
(3, 3, 3, 'Smt. Lakshmi Narayanan', '204/1A', 'PATTA-8840', 'KH-402', 'KT-512', 'Plot 8A', 3600.00, 'Sq.Ft', 'North: 90ft, South: 90ft, East: 40ft, West: 40ft', 'Mandaveli', 'Mylapore', 'Chennai', 'Tamil Nadu', '2025-01-10', 'Sub-Registrar Office, Mylapore', 'Thiru R. Venkatesh', 'A. Soundararajan', 'PENDING_VERIFICATION')
ON CONFLICT (id) DO NOTHING;

-- 6. EXTRACTED FIELDS (With confidence scores & human verification flags)
INSERT INTO extracted_fields (document_id, field_name, field_label, field_value, confidence_score, requires_human_verification, bounding_box, is_modified_by_officer, officer_modified_value)
VALUES 
(1, 'owner_name', 'Owner Name', 'Ramasamy Subramanian', 98.50, FALSE, '{"x": 120, "y": 150, "w": 280, "h": 24, "page": 1}', FALSE, NULL),
(1, 'survey_number', 'Survey Number', '142/3A', 96.00, FALSE, '{"x": 120, "y": 190, "w": 140, "h": 24, "page": 1}', FALSE, NULL),
(1, 'patta_number', 'Patta Number', 'PATTA-4521', 97.20, FALSE, '{"x": 300, "y": 190, "w": 140, "h": 24, "page": 1}', FALSE, NULL),
(1, 'land_area', 'Land Area', '2400 Sq.Ft', 94.80, FALSE, '{"x": 120, "y": 230, "w": 180, "h": 24, "page": 1}', FALSE, NULL),
(1, 'village', 'Village / Locality', 'Mylapore', 99.00, FALSE, '{"x": 120, "y": 270, "w": 160, "h": 24, "page": 1}', FALSE, NULL),
(1, 'taluk', 'Taluk', 'Mylapore', 98.40, FALSE, '{"x": 300, "y": 270, "w": 160, "h": 24, "page": 1}', FALSE, NULL),
(1, 'district', 'District', 'Chennai', 99.50, FALSE, '{"x": 120, "y": 310, "w": 160, "h": 24, "page": 1}', FALSE, NULL),
(2, 'owner_name', 'Owner Name', 'Ramasamy Subramanian', 97.80, FALSE, '{"x": 120, "y": 150, "w": 280, "h": 24, "page": 1}', FALSE, NULL),
(2, 'survey_number', 'Survey Number', '189/2B', 95.50, FALSE, '{"x": 120, "y": 190, "w": 140, "h": 24, "page": 1}', FALSE, NULL),
(2, 'land_area', 'Land Area', '2450 Sq.Ft (Was 2400)', 62.40, TRUE, '{"x": 120, "y": 230, "w": 180, "h": 24, "page": 1}', FALSE, NULL),
(2, 'previous_owner', 'Previous Owner', 'M/s Greenfield Reaitors', 68.00, TRUE, '{"x": 120, "y": 350, "w": 220, "h": 24, "page": 1}', FALSE, NULL);

-- 7. OCR RESULTS
INSERT INTO ocr_results (document_id, raw_text, engine_used, processing_time_ms, overall_confidence)
VALUES 
(1, 'GOVERNMENT OF TAMIL NADU - REVENUE DEPARTMENT\nPATTA / CHITTA EXTRACT (FORM NO. 11)\nDistrict: Chennai | Taluk: Mylapore | Village: Mylapore\nPatta No: PATTA-4521 | Survey No: 142/3A\nRegistered Owner: Ramasamy Subramanian\nArea: 2400.00 Sq.Ft\nRegistered at: Sub-Registrar Office, Mylapore', 'DIGILAND_OCR_v2_NEURAL', 412, 96.50),
(2, 'DEED OF CONVEYANCE AND BOUNDARY RECTIFICATION\nDistrict: Chennai | Taluk: Mylapore | Village: Alwarpet\nPatta No: PATTA-6610 | Survey No: 189/2B | Plot No: 44B\nOwner: Ramasamy Subramanian\nRectified Extent: 2450 Sq.Ft\nPrevious Transferor: M/s Greenfield Realtors', 'DIGILAND_OCR_v2_NEURAL', 520, 84.20);

-- 8. VALIDATION RESULTS
INSERT INTO validation_results (document_id, status, error_count, warning_count, validation_rules_passed, validation_rules_total, mismatch_details)
VALUES 
(1, 'VALID', 0, 0, 10, 10, '[]'),
(2, 'NEEDS_REVIEW', 0, 2, 8, 10, '[{"rule": "AREA_MATCH_CHECK", "severity": "WARNING", "message": "Document area (2450 Sq.Ft) is +50 Sq.Ft higher than prior revenue base record."}, {"rule": "CONFIDENCE_THRESHOLD", "severity": "WARNING", "message": "Field previous_owner confidence (68.00%) below 75% threshold."}]');

-- 9. GIS DATA (Polygons in Chennai coordinates: Lat ~13.0338, Lon ~80.2676)
INSERT INTO gis_data (id, land_record_id, survey_number, patta_number, village, taluk, district, latitude, longitude, boundary_polygon_geojson, area_sqft, zone_type)
VALUES 
(1, 1, '142/3A', 'PATTA-4521', 'Mylapore', 'Mylapore', 'Chennai', 13.0338000, 80.2676000, 
 '{"type": "Polygon", "coordinates": [[[80.2672, 13.0335], [80.2680, 13.0335], [80.2680, 13.0341], [80.2672, 13.0341], [80.2672, 13.0335]]]}', 
 2400.00, 'Residential'),
(2, 2, '189/2B', 'PATTA-6610', 'Alwarpet', 'Mylapore', 'Chennai', 13.0365000, 80.2524000, 
 '{"type": "Polygon", "coordinates": [[[80.2520, 13.0360], [80.2528, 13.0360], [80.2528, 13.0370], [80.2520, 13.0370], [80.2520, 13.0360]]]}', 
 2450.00, 'Residential'),
(3, 3, '204/1A', 'PATTA-8840', 'Mandaveli', 'Mylapore', 'Chennai', 13.0270000, 80.2610000, 
 '{"type": "Polygon", "coordinates": [[[80.2605, 13.0265], [80.2615, 13.0265], [80.2615, 13.0275], [80.2605, 13.0275], [80.2605, 13.0265]]]}', 
 3600.00, 'Commercial')
ON CONFLICT (id) DO NOTHING;

-- 10. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, notification_type, is_read, reference_type, reference_id, channel)
VALUES 
(1, 'Patta Record Verified', 'Your land document for Survey No 142/3A has been verified and approved by Tahsildar Dr. K. Ananthakrishnan.', 'DOCUMENT_APPROVED', TRUE, 'DOCUMENT', 1, 'ALL'),
(1, 'Document Update Under Review', 'Version 2 of your Sale Deed (DOC-TN-2025-9102) was queued for Tahsildar human-in-the-loop review due to area variance.', 'VERIFICATION_REQUIRED', FALSE, 'DOCUMENT', 2, 'IN_APP'),
(2, 'New Verification Queue Item', 'Document DOC-TN-2025-9102 (Survey 189/2B, Mylapore) requires your review due to low confidence field extractions.', 'VERIFICATION_REQUIRED', FALSE, 'DOCUMENT', 2, 'IN_APP');

-- 11. AUDIT LOGS
INSERT INTO audit_logs (user_id, user_email, user_role, action, entity_type, entity_id, ip_address, user_agent, details)
VALUES 
(1, 'citizen@digiland.gov.in', 'CITIZEN', 'USER_LOGIN', 'USER', '1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"status": "SUCCESS", "auth_method": "JWT"}'),
(1, 'citizen@digiland.gov.in', 'CITIZEN', 'DOCUMENT_UPLOAD', 'DOCUMENT', '1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"doc_num": "DOC-TN-2024-8841", "file": "sample_patta_142_3a.pdf"}'),
(2, 'officer@digiland.gov.in', 'GOVERNMENT_OFFICER', 'DOCUMENT_VERIFIED', 'DOCUMENT', '1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"remarks": "Original registry book cross-verified. Survey 142/3A is clear."}');
