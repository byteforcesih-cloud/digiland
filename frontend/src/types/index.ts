export type UserRole = 'CITIZEN' | 'GOVERNMENT_OFFICER' | 'ADMIN';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  aadhaar_masked: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  verification_status?: 'UNVERIFIED' | 'OTP_PENDING' | 'VERIFIED' | 'FAILED';
  storage_quota_mb?: number;
  storage_used_bytes?: number;
  preferred_language: LanguageCode;
  created_at: string;
  officer_profile?: OfficerProfile;
}

export interface OfficerProfile {
  id: number;
  officer_code: string;
  badge_number: string;
  designation: string;
  department: string;
  state: string;
  district: string;
  taluk: string;
  jurisdiction_scope?: string;
  is_authorized: boolean;
  total_verifications_completed: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  user_id: number;
  full_name: string;
  email: string;
  preferred_language: LanguageCode;
}

export interface MockAadhaarProfile {
  id: number;
  aadhaar_number?: string;
  full_name: string;
  father_name?: string;
  date_of_birth: string;
  gender: string;
  address?: string;
  address_line?: string;
  village?: string;
  village_town?: string;
  taluk?: string;
  district: string;
  state: string;
  pincode: string;
  phone_number?: string;
  phone_masked?: string;
  aadhaar_masked?: string;
  email?: string;
}

export interface IdentityStatus {
  user_id: number;
  is_verified: boolean;
  verification_status: 'UNVERIFIED' | 'OTP_PENDING' | 'VERIFIED' | 'FAILED';
  aadhaar_masked: string;
  verified_at?: string;
  profile?: MockAadhaarProfile;
}

export interface OTPRequestResponse {
  status: string;
  session_id: string;
  phone_masked: string;
  aadhaar_masked: string;
  demo_otp: string;
  expires_in_seconds: number;
  message: string;
}

export interface OTPConfirmResponse {
  status: string;
  message: string;
  profile: MockAadhaarProfile;
}

export interface CaptchaChallenge {
  captcha_token: string;
  question: string;
  image_svg: string;
  expires_in_seconds: number;
}

export interface ScanQualityResult {
  blur_score: number;
  brightness_score: number;
  contrast_score: number;
  glare_detected: boolean;
  darkness_detected: boolean;
  quality_label: 'EXCELLENT' | 'GOOD' | 'POOR' | 'UNACCEPTABLE';
  is_acceptable: boolean;
  recommendation: string;
}

export interface StorageFile {
  id: number;
  file_name: string;
  original_name?: string;
  original_filename?: string;
  file_path: string;
  file_size: number;
  file_size_formatted?: string;
  mime_type: string;
  folder_category: string;
  description?: string;
  is_encrypted: boolean;
  created_at: string;
}

export interface StorageUsage {
  total_quota_mb: number;
  quota_mb?: number;
  used_bytes: number;
  used_mb: number;
  usage_percentage: number;
  percentage_used?: number;
  total_files_count: number;
  files_count?: number;
  categories_breakdown: Record<string, number>;
}

export type DocumentType =
  | 'PATTA_CHITTA'
  | 'SALE_DEED'
  | 'ENCUMBRANCE_CERTIFICATE'
  | 'MUTATION_RECORD'
  | 'SETTLEMENT_DEED'
  | 'PARTITION_DEED'
  | 'TAX_RECEIPT'
  | 'SURVEY_SKETCH'
  | 'OTHER';

export type DocumentStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'VERIFICATION_REQUIRED'
  | 'CORRECTION_REQUESTED'
  | 'DUPLICATE_SUSPECTED'
  | 'POTENTIALLY_ALTERED';

export interface DocumentItem {
  id: number;
  user_id: number;
  document_number: string;
  title: string;
  document_type: DocumentType;
  current_version: number;
  status: DocumentStatus;
  file_path: string;
  file_type: string;
  file_size: number;
  original_filename: string;
  thumbnail_path?: string;
  is_locked: boolean;
  is_encrypted: boolean;
  created_at: string;
  updated_at?: string;
  user_name?: string;
  ocr_result?: OCRResult;
  extracted_fields?: ExtractedField[];
  validation_result?: ValidationResult;
  extracted_details?: DocumentExtractedDetails;
}

export interface ExtractedField {
  id: number;
  field_name: string;
  field_label: string;
  field_value: string;
  confidence_score: number;
  requires_human_verification: boolean;
  is_verified_by_officer?: boolean;
  is_modified_by_officer?: boolean;
  officer_adjusted_value?: string;
  officer_modified_value?: string;
}

export interface OCRResult {
  id: number;
  document_id: number;
  raw_text: string;
  engine_used: string;
  processing_time_ms: number;
  overall_confidence: number;
  created_at: string;
}

export interface DocumentExtractedDetails {
  document_id: number;
  document_type: string;
  document_title?: string;
  document_number?: string;
  registration_number?: string;
  document_date?: string;
  owner_name?: string;
  parent_guardian_name?: string;
  survey_number?: string;
  subdivision_number?: string;
  patta_number?: string;
  plot_number?: string;
  khata_number?: string;
  khasra_number?: string;
  door_number?: string;
  street_name?: string;
  address?: string;
  village?: string;
  taluk?: string;
  district?: string;
  state?: string;
  pincode?: string;
  land_area?: string;
  land_classification?: string;
  extracted_data?: Record<string, { value: string; confidence_label: string; score: number }>;
  confidence_data?: { overall_confidence: string; score: number };
  is_confirmed?: boolean;
}

export interface LandRecord {
  id: number;
  document_id?: number;
  user_id?: number;
  survey_number: string;
  subdivision_number?: string;
  patta_number?: string;
  khasra_number?: string;
  khata_number?: string;
  plot_number?: string;
  land_parcel_id?: string;
  owner_name: string;
  parent_guardian_name?: string;
  ownership_type: string;
  ownership_share?: string;
  contact_phone?: string;
  land_classification: string;
  land_category: string;
  land_area: number;
  area_unit: string;
  land_dimensions?: string;
  north_boundary?: string;
  south_boundary?: string;
  east_boundary?: string;
  west_boundary?: string;
  door_number?: string;
  building_name?: string;
  street_name?: string;
  area_locality?: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  pincode?: string;
  status: DocumentStatus;
  is_synthetic_demo: boolean;
  demo_watermark?: string;
  created_at: string;
  gis_data?: GISData;
}

export interface GISData {
  id: number;
  land_record_id: number;
  parcel_id: string;
  survey_number: string;
  subdivision_number?: string;
  patta_number?: string;
  street_name?: string;
  village: string;
  taluk: string;
  district: string;
  latitude: number;
  longitude: number;
  boundary_polygon_geojson: {
    type: string;
    coordinates: number[][][];
  };
  area_sqft: number;
  zone_type: string;
  nearby_roads?: string;
}

export type GISParcel = GISData;

export interface ValidationResult {
  id: number;
  document_id: number;
  status: 'VALID' | 'NEEDS_REVIEW' | 'INVALID' | 'VERIFICATION_PENDING';
  error_count: number;
  warning_count: number;
  validation_rules_passed: number;
  validation_rules_total: number;
  mismatch_details?: Array<{
    rule: string;
    severity: 'ERROR' | 'WARNING' | 'INFO';
    field?: string;
    message: string;
  }>;
  created_at: string;
}

export interface DuplicateRecord {
  id: number;
  document_id: number;
  matched_document_id: number;
  similarity_score: number;
  matched_fields: string[];
  status: 'DETECTED' | 'UNDER_INVESTIGATION' | 'DISMISSED' | 'CONFIRMED_FRAUD';
  resolution_remarks?: string;
  resolved_at?: string;
  created_at: string;
  document?: DocumentItem;
  matched_document?: DocumentItem;
}

export interface VerificationRecord {
  id: number;
  document_id: number;
  officer_id: number;
  verification_status: DocumentStatus;
  remarks?: string;
  correction_instructions?: string;
  field_adjustments?: Record<string, any>;
  verification_date: string;
}

export interface FraudAnalysisResult {
  document_id: number;
  overall_risk_score: number;
  risk_level: string;
  risk_band?: string;
  is_escalated?: boolean;
  escalation_reason?: string;
  image_tamper_score: number;
  ocr_consistency_score: number;
  metadata_inconsistency_score: number;
  anomaly_flags: string[];
  suspicious_regions: any[];
  is_reviewed_by_officer?: boolean;
  officer_remarks?: string;
  disclaimer: string;
}

export interface IntegrityBlock {
  block_index: number;
  version_number: number;
  action: string;
  current_hash: string;
  previous_hash: string;
  user_role: string;
  timestamp: string;
  status: string;
}

export interface DisputeCase {
  id: number;
  case_number: string;
  citizen_name?: string;
  title: string;
  description: string;
  category: string;
  survey_number: string;
  village: string;
  taluk?: string;
  district: string;
  state?: string;
  status: string;
  priority: string;
  assigned_officer?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
  evidences?: Array<{ id: number; file_name: string; file_size: number; description?: string; created_at: string }>;
  timeline?: Array<{ id: number; actor_role: string; action: string; status_changed_to?: string; remarks?: string; timestamp: string }>;
}

export interface DeviceSessionItem {
  id: number;
  device_name: string;
  device_type: string;
  ip_address?: string;
  last_active_at: string;
  created_at: string;
}

export interface LoginHistoryItem {
  id: number;
  ip_address: string;
  user_agent: string;
  is_successful: boolean;
  failure_reason?: string;
  timestamp: string;
}

export interface FeatureAccessItem {
  feature_key: string;
  feature_name: string;
  category: string;
  access_status: 'Allowed' | 'Restricted';
  is_allowed: boolean;
  restriction_reason: string;
}

export interface AuditLogItem {
  id: number;
  user_id?: number;
  user_email?: string;
  user_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  reference_type?: string;
  reference_id?: number;
  channel: string;
  created_at: string;
}

export interface ActionButton {
  label: string;
  path: string;
  action_type?: string;
}

export interface FlowchartStep {
  step: number;
  title: string;
  description: string;
  action_btn?: ActionButton | null;
}

export interface ChatbotAction {
  type: 'NAVIGATE' | 'CHANGE_LANGUAGE' | 'FILTER_DOCUMENTS' | 'OPEN_MODAL';
  path?: string;
  language?: LanguageCode;
  language_label?: string;
  filter?: string;
  label?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggested_actions?: string[];
  related_topics?: string[];
  flowchart?: FlowchartStep[];
  action?: ChatbotAction;
  live_data?: Record<string, any>;
  is_out_of_scope?: boolean;
}

export interface ChatQueryResponse {
  reply: string;
  suggested_actions?: string[];
  related_topics?: string[];
  flowchart?: FlowchartStep[];
  action?: ChatbotAction;
  live_data?: Record<string, any>;
  is_out_of_scope?: boolean;
  disclaimer: string;
}

export interface AIReviewSummary {
  overall_ai_score: number;
  quality_grade: string;
  ocr_confidence: number;
  risk_score: number;
  risk_level: string;
  tamper_score: number;
  is_duplicate_flagged: boolean;
  duplicate_similarity: number;
  matched_document_id?: number | null;
  validation_passed_count: number;
  validation_total_count: number;
  validation_errors: number;
  validation_warnings: number;
}

export interface AIReviewScheduleField {
  field_name: string;
  field_label: string;
  field_value: string;
  confidence: number;
  requires_human_verification: boolean;
  is_modified?: boolean;
  modified_value?: string;
}

export interface AIReviewData {
  document_id: number;
  document_number: string;
  title: string;
  document_type: string;
  version: number;
  status: string;
  review_timestamp: string;
  summary: AIReviewSummary;
  extracted_schedule: AIReviewScheduleField[];
  inconsistencies: Array<{ rule: string; field: string; severity: string; description: string }>;
  anomaly_flags: string[];
  missing_fields: string[];
  recommendations: string[];
  disclaimer: string;
}

