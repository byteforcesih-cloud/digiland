export interface TranslationDict {
  // Brand & General
  brandName: string;
  brandTagline: string;
  officialGovtPortal: string;
  allRightsReserved: string;
  tamperProofBlockchainProtected: string;
  languageName: string;

  // Common Actions & Buttons
  save: string;
  cancel: string;
  submit: string;
  delete: string;
  edit: string;
  view: string;
  download: string;
  upload: string;
  search: string;
  filter: string;
  clear: string;
  reset: string;
  retry: string;
  close: string;
  confirm: string;
  back: string;
  next: string;
  open: string;
  refresh: string;
  copy: string;
  copied: string;
  actions: string;
  status: string;
  date: string;
  details: string;
  loading: string;
  processing: string;
  pleaseWait: string;
  noData: string;
  noResultsFound: string;
  all: string;
  yes: string;
  no: string;
  viewDetails: string;
  viewReport: string;
  downloadCertificate: string;
  learnMore: string;

  // Status Labels
  statusVerified: string;
  statusPending: string;
  statusRejected: string;
  statusVerificationRequired: string;
  statusCorrectionRequested: string;
  statusDuplicateSuspected: string;
  statusUnderReview: string;
  statusFlaggedByOfficer: string;
  statusDismissed: string;
  statusConfirmedFraud: string;
  statusNeedsReview: string;
  statusSubmitted: string;
  statusResolved: string;
  statusActive: string;
  statusCompleted: string;
  statusFailed: string;
  statusEscalated: string;

  // Navigation & Shell
  login: string;
  register: string;
  logout: string;
  dashboard: string;
  myDocuments: string;
  uploadDocument: string;
  scanDocument: string;
  updateDocument: string;
  downloadDocument: string;
  landSearch: string;
  gisMap: string;
  verificationStatus: string;
  notifications: string;
  profile: string;
  auditHistory: string;
  mySecureStorage: string;
  identityVerification: string;
  disputes: string;
  citizenRecords: string;
  documentVerification: string;
  ocrReview: string;
  dataValidation: string;
  duplicateDetection: string;
  fraudReviewQueue: string;
  officerDisputes: string;
  auditLogs: string;
  roleCitizen: string;
  roleOfficer: string;
  roleAdmin: string;
  viewAll: string;
  markAllRead: string;
  noNotifications: string;

  // Auth Pages
  signInTitle: string;
  signInSubtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  emailOrPhone: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  age: string;
  selectRole: string;
  forgotPassword: string;
  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  sendResetLink: string;
  backToSignIn: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  demoCredentials: string;
  loginAsCitizen: string;
  loginAsOfficer: string;
  invalidCredentials: string;
  passwordsDoNotMatch: string;
  accountCreatedSuccess: string;

  // Dashboard Common & Widgets
  welcomeBack: string;
  portalOverview: string;
  totalDocuments: string;
  processingDocuments: string;
  verifiedRecords: string;
  pendingVerification: string;
  issuesDetected: string;
  recentDocuments: string;
  recentActivity: string;
  verificationProgress: string;
  quickActions: string;
  requiresHumanVerification: string;
  potentialDuplicateDetected: string;
  activeDisputes: string;
  systemIntegrityStatus: string;
  verifiedIntegrityDesc: string;

  // Land Search & GIS
  landSearchTitle: string;
  landSearchSubtitle: string;
  cascadingLocationFilter: string;
  selectState: string;
  selectDistrict: string;
  selectTaluk: string;
  selectVillage: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  pattaNumber: string;
  khasraNumber: string;
  ownerName: string;
  searchByParameters: string;
  matchingLandRecords: string;
  parcelDetails: string;
  extentArea: string;
  landClassification: string;
  subdivision: string;
  viewOnMap: string;
  gisCadastralViewer: string;
  mapLayers: string;
  zoomIn: string;
  zoomOut: string;

  // Document Management & Dropzone
  documentNumber: string;
  documentTitle: string;
  documentType: string;
  fileSize: string;
  version: string;
  uploadedOn: string;
  verifiedOn: string;
  dragAndDropFiles: string;
  orBrowseFiles: string;
  supportedFormats: string;
  maxFileSize: string;
  uploadNewVersion: string;
  reasonForUpdate: string;
  deleteDocumentTitle: string;
  deleteDocumentConfirm: string;
  passwordProtectedUnlockInfo: string;
  passwordFormulaExplanation: string;
  testPassword: string;
  unlockFormulaExample: string;

  // Scan Document & Camera OCR
  cameraScannerTitle: string;
  cameraScannerSubtitle: string;
  startCamera: string;
  stopCamera: string;
  capturePage: string;
  retakePage: string;
  switchCamera: string;
  scannedPages: string;
  addPage: string;
  removePage: string;
  compileAndRunOCR: string;
  imageQualityScore: string;
  ocrConfidence: string;
  extracted17Fields: string;
  fieldLabel: string;
  extractedValue: string;
  confidenceScore: string;
  verifiedByOfficer: string;

  // Verification Queue & Split Screen
  verificationQueueTitle: string;
  verificationQueueSubtitle: string;
  splitScreenReview: string;
  originalDeedPreview: string;
  extractedScheduleComparison: string;
  officerDecision: string;
  approveDeed: string;
  rejectDeed: string;
  requestCorrection: string;
  markAsDuplicate: string;
  officerRemarks: string;
  correctionInstructions: string;
  approvalHistory: string;
  decisionSubmittedSuccess: string;

  // AI Document Review
  aiReviewTitle: string;
  aiReviewSubtitle: string;
  overallAIScore: string;
  qualityGrade: string;
  compulsoryOfficerInspection: string;
  ruleValidationChecks: string;
  inconsistenciesDetected: string;
  duplicateOverlapRisk: string;
  digitalImageForensics: string;
  tamperRiskScore: string;
  officerRecommendations: string;
  regenerateAIReview: string;
  aiDisclaimer: string;

  // Duplicate Detection Module
  duplicateDetectionTitle: string;
  duplicateDetectionSubtitle: string;
  similarityScore: string;
  matchedFields: string;
  comparedDocuments: string;
  investigateDuplicate: string;
  confirmFraud: string;
  dismissDuplicate: string;
  duplicateResolutionRemarks: string;

  // Mock Aadhaar KYC
  mockAadhaarTitle: string;
  mockAadhaarSubtitle: string;
  enter12DigitAadhaar: string;
  requestOTP: string;
  enter6DigitOTP: string;
  verifyOTP: string;
  kycVerifiedSuccess: string;
  syntheticDemoAccounts: string;
  useDemoProfile: string;

  // 1GB Secure Storage Vault
  storageVaultTitle: string;
  storageVaultSubtitle: string;
  quotaUsage: string;
  vaultFolderCategories: string;
  uploadToVault: string;
  folderCategory: string;
  encryptedWithAES256: string;
  downloadDecryptedFile: string;

  // Land Disputes & Grievances
  disputesTitle: string;
  disputesSubtitle: string;
  fileNewDispute: string;
  disputeCategory: string;
  encroachmentDetails: string;
  uploadEvidenceDocuments: string;
  scheduledHearingDate: string;
  resolutionSummary: string;

  // Audit Logs & Security Ops
  auditLogsTitle: string;
  auditLogsSubtitle: string;
  blockchainIntegrityChain: string;
  blockHash: string;
  previousHash: string;
  actor: string;
  ipAddress: string;
  eventAction: string;
  tamperIntegrityVerified: string;
  fraudReviewTitle: string;
  fraudReviewSubtitle: string;

  // Profile & Settings
  profileTitle: string;
  profileSubtitle: string;
  personalInformation: string;
  accountSecurity: string;
  changePasswordTitle: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  preferredLanguage: string;

  // AI Assistant Chatbot
  aiAssistant: string;
  askAssistant: string;
  listeningVoice: string;
  speakQuestion: string;
  stopVoice: string;
  voiceSynchronized: string;
}

export const translations: Record<string, TranslationDict> = {
  en: {
    brandName: "DigiLand",
    brandTagline: "AI-Powered Digital Land Record Management System",
    officialGovtPortal: "Official Land Administration & Revenue Portal",
    allRightsReserved: "Government of India. All rights reserved.",
    tamperProofBlockchainProtected: "Protected by SHA-256 Tamper-Proof Audit Chain",
    languageName: "English",

    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    download: "Download",
    upload: "Upload",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    reset: "Reset",
    retry: "Retry",
    close: "Close",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    open: "Open",
    refresh: "Refresh",
    copy: "Copy",
    copied: "Copied!",
    actions: "Actions",
    status: "Status",
    date: "Date",
    details: "Details",
    loading: "Loading...",
    processing: "Processing...",
    pleaseWait: "Please wait...",
    noData: "No data available",
    noResultsFound: "No matching records found",
    all: "All",
    yes: "Yes",
    no: "No",
    viewDetails: "View Details",
    viewReport: "View AI Report",
    downloadCertificate: "Download Certificate",
    learnMore: "Learn More",

    statusVerified: "Verified",
    statusPending: "Pending Review",
    statusRejected: "Rejected",
    statusVerificationRequired: "Verification Required",
    statusCorrectionRequested: "Correction Requested",
    statusDuplicateSuspected: "Duplicate Suspected",
    statusUnderReview: "Under Review",
    statusFlaggedByOfficer: "Flagged by Officer",
    statusDismissed: "Dismissed",
    statusConfirmedFraud: "Confirmed Fraud",
    statusNeedsReview: "Needs Review",
    statusSubmitted: "Submitted",
    statusResolved: "Resolved",
    statusActive: "Active",
    statusCompleted: "Completed",
    statusFailed: "Failed",
    statusEscalated: "Escalated",

    login: "Sign In",
    register: "Register Account",
    logout: "Sign Out",
    dashboard: "Dashboard",
    myDocuments: "My Documents",
    uploadDocument: "Upload Document",
    scanDocument: "Scan Document",
    updateDocument: "Update Document",
    downloadDocument: "Download Document",
    landSearch: "Land Search",
    gisMap: "GIS Parcel Map",
    verificationStatus: "Verification Status",
    notifications: "Notifications",
    profile: "User Profile",
    auditHistory: "Audit History",
    mySecureStorage: "My Secure Storage",
    identityVerification: "Mock Aadhaar KYC",
    disputes: "Land Disputes",
    citizenRecords: "Citizen Records",
    documentVerification: "Document Verification",
    ocrReview: "OCR Review",
    dataValidation: "Data Validation",
    duplicateDetection: "Duplicate Detection",
    fraudReviewQueue: "Fraud Review Queue",
    officerDisputes: "Dispute Redressal",
    auditLogs: "System Audit Logs",
    roleCitizen: "Citizen Portal",
    roleOfficer: "Government Officer Portal",
    roleAdmin: "Revenue Admin Portal",
    viewAll: "View All",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications",

    signInTitle: "Sign In to DigiLand",
    signInSubtitle: "Access your verified digital land titles, deeds, and revenue services",
    registerTitle: "Create DigiLand Account",
    registerSubtitle: "Register with your credentials for direct land ownership and verification services",
    emailOrPhone: "Email Address or Phone Number",
    emailAddress: "Email Address",
    phoneNumber: "Mobile Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Legal Name",
    age: "Age",
    selectRole: "Select Portal Role",
    forgotPassword: "Forgot Password?",
    forgotPasswordTitle: "Reset Password",
    forgotPasswordSubtitle: "Enter your registered email to receive a password reset link",
    sendResetLink: "Send Reset Link",
    backToSignIn: "Back to Sign In",
    alreadyHaveAccount: "Already registered? Sign In",
    dontHaveAccount: "New user? Create an account",
    demoCredentials: "Quick Demo Credentials",
    loginAsCitizen: "Login as Citizen",
    loginAsOfficer: "Login as Revenue Officer",
    invalidCredentials: "Invalid email/phone or password.",
    passwordsDoNotMatch: "Passwords do not match.",
    accountCreatedSuccess: "Account registered successfully! You can now sign in.",

    welcomeBack: "Welcome back",
    portalOverview: "Land Administration Dashboard Overview",
    totalDocuments: "Total Documents",
    processingDocuments: "Processing",
    verifiedRecords: "Verified Records",
    pendingVerification: "Pending Verification",
    issuesDetected: "Issues Flagged",
    recentDocuments: "Recent Documents",
    recentActivity: "Recent System Activity",
    verificationProgress: "Verification Rate",
    quickActions: "Quick Actions",
    requiresHumanVerification: "Requires Officer Verification",
    potentialDuplicateDetected: "Potential Duplicate Overlap Detected",
    activeDisputes: "Active Boundary Grievances",
    systemIntegrityStatus: "Security & Hash Integrity",
    verifiedIntegrityDesc: "All records secured with cryptographic hash chaining.",

    landSearchTitle: "Cadastral Land Search",
    landSearchSubtitle: "Search land parcels by cascading jurisdiction hierarchy and revenue parameters",
    cascadingLocationFilter: "Cascading Location Filter",
    selectState: "Select State",
    selectDistrict: "Select District",
    selectTaluk: "Select Taluk",
    selectVillage: "Select Revenue Village",
    district: "District",
    taluk: "Taluk / Tehsil",
    village: "Village",
    surveyNumber: "Survey Number",
    pattaNumber: "Patta Number",
    khasraNumber: "Khasra Number",
    ownerName: "Pattadar / Owner Name",
    searchByParameters: "Search Land Records",
    matchingLandRecords: "Matching Land Parcels",
    parcelDetails: "Land Parcel Details",
    extentArea: "Extent & Area",
    landClassification: "Classification",
    subdivision: "Subdivision",
    viewOnMap: "View Parcel on GIS Map",
    gisCadastralViewer: "GIS Cadastral Parcel Viewer",
    mapLayers: "Map Layers",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",

    documentNumber: "Document Number",
    documentTitle: "Document Title",
    documentType: "Document Type",
    fileSize: "File Size",
    version: "Version",
    uploadedOn: "Uploaded Date",
    verifiedOn: "Verified Date",
    dragAndDropFiles: "Drag and drop your digital deed PDF here",
    orBrowseFiles: "or browse files from your computer",
    supportedFormats: "Supported formats: PDF, JPEG, PNG (Max 25MB)",
    maxFileSize: "Maximum upload size: 25MB",
    uploadNewVersion: "Upload New Document Version",
    reasonForUpdate: "Reason for Document Revision",
    deleteDocumentTitle: "Delete Land Document",
    deleteDocumentConfirm: "Are you sure you want to delete this document? This action cannot be undone.",
    passwordProtectedUnlockInfo: "Password-Protected Certificate",
    passwordFormulaExplanation: "Downloaded certificates are encrypted for privacy. Unlock formula: Survey Number (no slashes) + Owner First Name in UPPERCASE.",
    testPassword: "Test Password Unlock",
    unlockFormulaExample: "Example: 142/3A + Ramasamy -> 1423ARAMASAMY",

    cameraScannerTitle: "Multi-Page Camera Scanner & OCR",
    cameraScannerSubtitle: "Capture physical land deeds with automated quality assessment and 17-field schedule extraction",
    startCamera: "Start Camera",
    stopCamera: "Stop Camera",
    capturePage: "Capture Page",
    retakePage: "Retake Page",
    switchCamera: "Switch Camera",
    scannedPages: "Captured Pages",
    addPage: "Add Another Page",
    removePage: "Remove Page",
    compileAndRunOCR: "Compile Document & Run AI OCR",
    imageQualityScore: "Image Quality Score",
    ocrConfidence: "OCR Extraction Confidence",
    extracted17Fields: "Extracted 17-Field Land Schedule",
    fieldLabel: "Schedule Field",
    extractedValue: "Extracted Value",
    confidenceScore: "Confidence",
    verifiedByOfficer: "Verified by Officer",

    verificationQueueTitle: "Officer Document Verification Queue",
    verificationQueueSubtitle: "Inspect extracted land schedules, run AI forensics, and submit digital verification decisions",
    splitScreenReview: "Split-Screen Deed Inspection",
    originalDeedPreview: "Original Document Preview",
    extractedScheduleComparison: "Extracted Schedule vs Revenue Registry",
    officerDecision: "Officer Decision",
    approveDeed: "Approve Deed (Issue Verified Certificate)",
    rejectDeed: "Reject Document",
    requestCorrection: "Request Citizen Correction",
    markAsDuplicate: "Mark as Suspected Duplicate",
    officerRemarks: "Official Verification Remarks",
    correctionInstructions: "Citizen Correction Instructions",
    approvalHistory: "Workflow & Audit Timeline",
    decisionSubmittedSuccess: "Verification verdict recorded successfully.",

    aiReviewTitle: "AI Document Review & Intelligence",
    aiReviewSubtitle: "Automated classification, 17-field schedule analysis, duplicate overlap, and tamper risk scoring",
    overallAIScore: "Overall AI Confidence Score",
    qualityGrade: "Quality Grade",
    compulsoryOfficerInspection: "Compulsory Verification Queue Inspection",
    ruleValidationChecks: "Rule Validation Checks",
    inconsistenciesDetected: "Discrepancies Flagged",
    duplicateOverlapRisk: "Duplicate & Boundary Overlap Risk",
    digitalImageForensics: "Image Forensics & Tamper Risk",
    tamperRiskScore: "Tamper Risk Score",
    officerRecommendations: "Actionable Officer Recommendations",
    regenerateAIReview: "Re-run AI Analysis",
    aiDisclaimer: "AI Review is generated by automated OCR and integrity models to assist officers. Final legal authority remains with the designated Tahsildar.",

    duplicateDetectionTitle: "Duplicate & Boundary Overlap Detection",
    duplicateDetectionSubtitle: "Identify overlapping survey numbers, duplicate patta records, and dual registration attempts",
    similarityScore: "Similarity Score",
    matchedFields: "Matched Identifiers",
    comparedDocuments: "Compare Conflicting Deeds",
    investigateDuplicate: "Investigate Conflict",
    confirmFraud: "Confirm as Fraudulent Duplicate",
    dismissDuplicate: "Dismiss (Legitimate Transfer)",
    duplicateResolutionRemarks: "Resolution Remarks",

    mockAadhaarTitle: "Mock Aadhaar Identity Verification (KYC)",
    mockAadhaarSubtitle: "Simulate government identity verification with demo Aadhaar profiles and instant OTP",
    enter12DigitAadhaar: "Enter 12-Digit Aadhaar Number",
    requestOTP: "Request Demo OTP",
    enter6DigitOTP: "Enter 6-Digit Verification Code",
    verifyOTP: "Verify Identity",
    kycVerifiedSuccess: "Identity Verified Successfully",
    syntheticDemoAccounts: "Pre-Configured Demo Citizens",
    useDemoProfile: "Use Profile",

    storageVaultTitle: "My Secure Storage (1GB Free Vault)",
    storageVaultSubtitle: "Store original deeds and tax receipts with military-grade AES-256 GCM client-side encryption",
    quotaUsage: "Storage Quota Usage",
    vaultFolderCategories: "Vault Folders",
    uploadToVault: "Upload File to Vault",
    folderCategory: "Folder Category",
    encryptedWithAES256: "Encrypted with AES-256 GCM",
    downloadDecryptedFile: "Download Decrypted File",

    disputesTitle: "Land Grievance & Boundary Dispute Redressal",
    disputesSubtitle: "File boundary encroachment complaints, track hearing schedules, and view revenue officer resolutions",
    fileNewDispute: "File New Land Grievance",
    disputeCategory: "Dispute Category",
    encroachmentDetails: "Boundary / Encroachment Description",
    uploadEvidenceDocuments: "Upload Supporting Evidence Deeds",
    scheduledHearingDate: "Scheduled Hearing Date",
    resolutionSummary: "Revenue Officer Resolution Summary",

    auditLogsTitle: "System Audit Logs & Blockchain Hash Chain",
    auditLogsSubtitle: "Tamper-evident cryptographic ledger recording every document upload, edit, verification, and decision",
    blockchainIntegrityChain: "Cryptographic Tamper-Evident Ledger",
    blockHash: "SHA-256 Block Hash",
    previousHash: "Previous Hash",
    actor: "Actor / Officer",
    ipAddress: "IP Address",
    eventAction: "Event Action",
    tamperIntegrityVerified: "100% Hash Chain Integrity Verified",
    fraudReviewTitle: "AI Fraud & Digital Tamper Forensics",
    fraudReviewSubtitle: "Inspect Error Level Analysis (ELA), font inconsistencies, and metadata tampering",

    profileTitle: "User Profile & Security Settings",
    profileSubtitle: "Manage your registered profile details, security credentials, and preferred portal language",
    personalInformation: "Personal Information",
    accountSecurity: "Security & Credentials",
    changePasswordTitle: "Change Account Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    preferredLanguage: "Portal Language",

    aiAssistant: "DigiLand AI Assistant",
    askAssistant: "Ask about Patta, Survey No, or Verification...",
    listeningVoice: "Listening to voice input...",
    speakQuestion: "Speak your question clearly",
    stopVoice: "Stop Voice",
    voiceSynchronized: "Voice Synchronized • 6 Languages"
  },
  ta: {
    brandName: "டிஜிலாண்ட்",
    brandTagline: "செயற்கை நுண்ணறிவு நில ஆவண மேலாண்மை தளம்",
    officialGovtPortal: "அதிகாரப்பூர்வ நில நிர்வாகம் மற்றும் வருவாய்த்துறை தளம்",
    allRightsReserved: "இந்திய அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    tamperProofBlockchainProtected: "SHA-256 தணிக்கை சங்கிலியால் பாதுகாக்கப்பட்டது",
    languageName: "தமிழ்",

    save: "சேமி",
    cancel: "ரத்து செய்",
    submit: "சமர்ப்பி",
    delete: "நீக்கு",
    edit: "திருத்து",
    view: "பார்வை",
    download: "பதிவிறக்கு",
    upload: "பதிவேற்று",
    search: "தேடு",
    filter: "வடிகட்டு",
    clear: "அழி",
    reset: "மீட்டமை",
    retry: "மீண்டும் முயல்க",
    close: "மூடு",
    confirm: "உறுதி செய்",
    back: "பின்செல்",
    next: "அடுத்து",
    open: "திற",
    refresh: "புதுப்பி",
    copy: "நகலெடு",
    copied: "நகலெடுக்கப்பட்டது!",
    actions: "செயல்கள்",
    status: "நிலை",
    date: "தேதி",
    details: "விவரங்கள்",
    loading: "ஏற்றுகிறது...",
    processing: "செயல்பாட்டில் உள்ளது...",
    pleaseWait: "தயவுசெய்து காத்திருக்கவும்...",
    noData: "தரவு எதுவும் இல்லை",
    noResultsFound: "பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை",
    all: "அனைத்தும்",
    yes: "ஆம்",
    no: "இல்லை",
    viewDetails: "விவரங்களை காண்க",
    viewReport: "AI அறிக்கையை காண்க",
    downloadCertificate: "சான்றிதழ் பதிவிறக்கம்",
    learnMore: "மேலும் அறிக",

    statusVerified: "சரிபார்க்கப்பட்டது",
    statusPending: "மறுஆய்வில் உள்ளது",
    statusRejected: "நிராகரிக்கப்பட்டது",
    statusVerificationRequired: "சரிபார்ப்பு தேவை",
    statusCorrectionRequested: "திருத்தம் கோரப்பட்டது",
    statusDuplicateSuspected: "போலி ஆவணம் சந்தேகிக்கப்படுகிறது",
    statusUnderReview: "பரிசீலனையில் உள்ளது",
    statusFlaggedByOfficer: "அதிகாரியால் கொடியிடப்பட்டது",
    statusDismissed: "தள்ளுபடி செய்யப்பட்டது",
    statusConfirmedFraud: "மோசடி உறுதிப்படுத்தப்பட்டது",
    statusNeedsReview: "மறுஆய்வு தேவை",
    statusSubmitted: "சமர்ப்பிக்கப்பட்டது",
    statusResolved: "தீர்க்கப்பட்டது",
    statusActive: "செயலில் உள்ளது",
    statusCompleted: "நிறைவடைந்தது",
    statusFailed: "தோல்வியடைந்தது",
    statusEscalated: "மேலதிகாரிக்கு மாற்றப்பட்டது",

    login: "உள்நுழைக",
    register: "பதிவு செய்க",
    logout: "வெளியேறு",
    dashboard: "முகப்பு",
    myDocuments: "எனது ஆவணங்கள்",
    uploadDocument: "ஆவணம் பதிவேற்றுக",
    scanDocument: "ஆவணம் ஸ்கேன் செய்க",
    updateDocument: "ஆவணத்தை புதுப்பிக்கவும்",
    downloadDocument: "ஆவணம் பதிவிறக்குக",
    landSearch: "நில விவரம் தேடுக",
    gisMap: "புவிசார் வரைபடம் (GIS)",
    verificationStatus: "சரிபார்ப்பு நிலை",
    notifications: "அறிவிப்புகள்",
    profile: "சுயவிவரம்",
    auditHistory: "தணிக்கை வரலாறு",
    mySecureStorage: "எனது பாதுகாப்பான பெட்டகம்",
    identityVerification: "ஆதார் சரிபார்ப்பு",
    disputes: "நில தகராறுகள்",
    citizenRecords: "குடிமக்கள் பதிவுகள்",
    documentVerification: "ஆவண சரிபார்ப்பு",
    ocrReview: "OCR மறுஆய்வு",
    dataValidation: "தரவு சரிபார்ப்பு",
    duplicateDetection: "போலி ஆவண கண்டறிதல்",
    fraudReviewQueue: "மோசடி மறுஆய்வு வரிசை",
    officerDisputes: "புகார் தீர்வு தளம்",
    auditLogs: "அமைப்பு தணிக்கை பதிவுகள்",
    roleCitizen: "குடிமக்கள் தளம்",
    roleOfficer: "அரசு அலுவலர் தளம்",
    roleAdmin: "வருவாய் நிர்வாக தளம்",
    viewAll: "அனைத்தையும் காண்க",
    markAllRead: "அனைத்தையும் படித்ததாக குறி",
    noNotifications: "புதிய அறிவிப்புகள் இல்லை",

    signInTitle: "டிஜிலாண்டில் உள்நுழைக",
    signInSubtitle: "உங்கள் சரிபார்க்கப்பட்ட நில ஆவணங்கள் மற்றும் வருவாய் சேவைகளை அணுகவும்",
    registerTitle: "டிஜிலாண்ட் கணக்கை உருவாக்கவும்",
    registerSubtitle: "நில உரிமை மற்றும் சரிபார்ப்பு சேவைகளுக்கு பதிவு செய்யவும்",
    emailOrPhone: "மின்னஞ்சல் அல்லது தொலைபேசி எண்",
    emailAddress: "மின்னஞ்சல் முகவரி",
    phoneNumber: "கைப்பேசி எண்",
    password: "கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்துக",
    fullName: "முழு பெயர்",
    age: "வயது",
    selectRole: "பயனர் வகையை தேர்ந்தெடுக்கவும்",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    forgotPasswordTitle: "கடவுச்சொல்லை மீட்டமைக்க",
    forgotPasswordSubtitle: "கடவுச்சொல் மீட்டமைப்பு இணைப்பைப் பெற மின்னஞ்சலை உள்ளிடவும்",
    sendResetLink: "மீட்டமைப்பு இணைப்பு அனுப்புக",
    backToSignIn: "உள்நுழைவுக்கு திரும்புக",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    dontHaveAccount: "புதிய பயனரா? கணக்கை உருவாக்கவும்",
    demoCredentials: "மாதிரி உள்நுழைவு விவரங்கள்",
    loginAsCitizen: "குடிமகனாக உள்நுழைக",
    loginAsOfficer: "வருவாய் அலுவலராக உள்நுழைக",
    invalidCredentials: "தவறான மின்னஞ்சல்/தொலைபேசி அல்லது கடவுச்சொல்.",
    passwordsDoNotMatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
    accountCreatedSuccess: "கணக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டது! இப்போது உள்நுழையலாம்.",

    welcomeBack: "மீண்டும் வருக",
    portalOverview: "நில நிர்வாக முகப்பு மேலோட்டம்",
    totalDocuments: "மொத்த ஆவணங்கள்",
    processingDocuments: "செயல்பாட்டில் உள்ளது",
    verifiedRecords: "சரிபார்க்கப்பட்ட ஆவணங்கள்",
    pendingVerification: "சரிபார்ப்பிற்கு காத்திருப்பு",
    issuesDetected: "கண்டறியப்பட்ட சிக்கல்கள்",
    recentDocuments: "சமீபத்திய ஆவணங்கள்",
    recentActivity: "சமீபத்திய செயல்பாடு",
    verificationProgress: "சரிபார்ப்பு விகிதம்",
    quickActions: "விரைவுச் செயல்கள்",
    requiresHumanVerification: "மனித சரிபார்ப்பு தேவை",
    potentialDuplicateDetected: "போலி ஆவணம் கண்டறியப்பட்டது",
    activeDisputes: "செயலில் உள்ள நில தகராறுகள்",
    systemIntegrityStatus: "பாதுகாப்பு & ஒருமைப்பாடு",
    verifiedIntegrityDesc: "அனைத்து ஆவணங்களும் குறியாக்க சங்கிலியால் பாதுகாக்கப்பட்டுள்ளன.",

    landSearchTitle: "நில அளவை தேடல்",
    landSearchSubtitle: "வருவாய் படிநிலை மற்றும் புல எண்கள் மூலம் நிலங்களை தேடுக",
    cascadingLocationFilter: "படிநிலை இட வடிகட்டி",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    selectTaluk: "தாலுகாவைத் தேர்ந்தெடுக்கவும்",
    selectVillage: "வருவாய் கிராமத்தைத் தேர்ந்தெடுக்கவும்",
    district: "மாவட்டம்",
    taluk: "தாலுகா",
    village: "கிராமம்",
    surveyNumber: "சர்வே எண் (புல எண்)",
    pattaNumber: "பட்டா எண்",
    khasraNumber: "கஸ்ரா எண்",
    ownerName: "பட்டாதாரர் / உரிமையாளர் பெயர்",
    searchByParameters: "நில விவரங்களை தேடுக",
    matchingLandRecords: "பொருந்தும் நிலப் பதிவுகள்",
    parcelDetails: "நில விவரக் குறிப்பு",
    extentArea: "நில பரப்பளவு",
    landClassification: "நில வகைப்பாடு",
    subdivision: "உட்பிரிவு எண்",
    viewOnMap: "GIS வரைபடத்தில் பார்க்க",
    gisCadastralViewer: "GIS நில வரைபட பார்வை",
    mapLayers: "வரைபட அடுக்குகள்",
    zoomIn: "பெரிதாக்கு",
    zoomOut: "சிறிதாக்கு",

    documentNumber: "ஆவண எண்",
    documentTitle: "ஆவண தலைப்பு",
    documentType: "ஆவண வகை",
    fileSize: "கோப்பு அளவு",
    version: "பதிப்பு",
    uploadedOn: "பதிவேற்றப்பட்ட தேதி",
    verifiedOn: "சரிபார்க்கப்பட்ட தேதி",
    dragAndDropFiles: "உங்கள் நில ஆவண PDF-ஐ இங்கே இழுத்து விடவும்",
    orBrowseFiles: "அல்லது கணினியிலிருந்து கோப்பை தேர்ந்தெடுக்கவும்",
    supportedFormats: "அனுமதிக்கப்பட்ட வடிவங்கள்: PDF, JPEG, PNG (அதிகபட்சம் 25MB)",
    maxFileSize: "அதிகபட்ச கோப்பு அளவு: 25MB",
    uploadNewVersion: "புதிய பதிப்பை பதிவேற்றுக",
    reasonForUpdate: "ஆவண புதுப்பித்தலுக்கான காரணம்",
    deleteDocumentTitle: "நில ஆவணத்தை நீக்கு",
    deleteDocumentConfirm: "இந்த ஆவணத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா? இந்த செயலை மாற்ற முடியாது.",
    passwordProtectedUnlockInfo: "கடவுச்சொல் பாதுகாக்கப்பட்ட சான்றிதழ்",
    passwordFormulaExplanation: "சான்றிதழ் பாதுகாப்பானது. திறக்கும் சூத்திரம்: சர்வே எண் (சாய்வுக் கோடு இன்றி) + உரிமையாளர் முதல் பெயர் ஆங்கில பெரிய எழுத்துக்களில்.",
    testPassword: "கடவுச்சொல் சரிபார்ப்பு",
    unlockFormulaExample: "எடுத்துக்காட்டு: 142/3A + Ramasamy -> 1423ARAMASAMY",

    cameraScannerTitle: "பல பக்க கேமரா ஸ்கேனர் & OCR",
    cameraScannerSubtitle: "நில ஆவணங்களை கேமரா மூலம் படம்பிடித்து 17 விவரங்களை உடனுக்குடன் பிரித்தெடுக்கவும்",
    startCamera: "கேமராவை தொடங்கு",
    stopCamera: "கேமராவை நிறுத்து",
    capturePage: "பக்கத்தை படம்பிடி",
    retakePage: "மீண்டும் படம்பிடி",
    switchCamera: "கேமராவை மாற்று",
    scannedPages: "படம்பிடிக்கப்பட்ட பக்கங்கள்",
    addPage: "மற்றொரு பக்கத்தை சேர்",
    removePage: "பக்கத்தை நீக்கு",
    compileAndRunOCR: "ஆவணத்தை தொகுத்து OCR செய்க",
    imageQualityScore: "படத்தின் தர மதிப்பீடு",
    ocrConfidence: "OCR பிரித்தெடுக்கும் நம்பகத்தன்மை",
    extracted17Fields: "பிரித்தெடுக்கப்பட்ட 17 நில விவர அட்டவணை",
    fieldLabel: "விவரப் பெயர்",
    extractedValue: "பிரித்தெடுக்கப்பட்ட மதிப்பு",
    confidenceScore: "நம்பகத்தன்மை",
    verifiedByOfficer: "அதிகாரியால் சரிபார்க்கப்பட்டது",

    verificationQueueTitle: "அலுவலர் ஆவண சரிபார்ப்பு வரிசை",
    verificationQueueSubtitle: "நில அட்டவணையை ஆய்வு செய்து, AI தடயங்களை சரிபார்த்து முடிவுகளை சமர்ப்பிக்கவும்",
    splitScreenReview: "இருபக்க ஆவண ஆய்வு",
    originalDeedPreview: "அசல் ஆவண முன்னோட்டம்",
    extractedScheduleComparison: "பிரித்தெடுக்கப்பட்ட அட்டவணை vs அரசு பதிவேடு",
    officerDecision: "அலுவலர் முடிவு",
    approveDeed: "ஆவணத்தை அங்கீகரி (சான்றிதழ் வழங்குக)",
    rejectDeed: "ஆவணத்தை நிராகரி",
    requestCorrection: "குடிமகனிடம் திருத்தம் கோருக",
    markAsDuplicate: "போலி ஆவணமாக குறிக்க",
    officerRemarks: "அதிகாரப்பூர்வ கருத்துக்கள்",
    correctionInstructions: "திருத்த வழிகாட்டுதல்கள்",
    approvalHistory: "அங்கீகார வரலாறு",
    decisionSubmittedSuccess: "சரிபார்ப்பு முடிவு வெற்றிகரமாக பதிவு செய்யப்பட்டது.",

    aiReviewTitle: "AI ஆவண மறுஆய்வு & புலனாய்வு",
    aiReviewSubtitle: "தானியங்கி வகைப்பாடு, 17-புல அட்டவணை பகுப்பாய்வு, போலி கண்டறிதல் மற்றும் சேத மதிப்பீடு",
    overallAIScore: "ஒட்டுமொத்த AI மதிப்பீடு",
    qualityGrade: "தர நிலை",
    compulsoryOfficerInspection: "கட்டாய அலுவலர் ஆய்வு",
    ruleValidationChecks: "விதி சரிபார்ப்பு சோதனைகள்",
    inconsistenciesDetected: "முரண்பாடுகள் கண்டறியப்பட்டன",
    duplicateOverlapRisk: "போலி மற்றும் எல்லை ஒன்றுடன் ஒன்று ஆபத்து",
    digitalImageForensics: "பட தடயவியல் மற்றும் சேத மதிப்பீடு",
    tamperRiskScore: "சேத அபாய மதிப்பெண்",
    officerRecommendations: "அலுவலருக்கான பரிந்துரைகள்",
    regenerateAIReview: "AI மறுஆய்வை மீண்டும் இயக்கு",
    aiDisclaimer: "AI மறுஆய்வு என்பது அதிகாரிகளுக்கு உதவ உருவாக்கப்பட்ட தானியங்கி அறிக்கை ஆகும். இறுதி முடிவு வட்டாட்சியரையே சாரும்.",

    duplicateDetectionTitle: "போலி ஆவணம் & எல்லை முரண்பாடு கண்டறிதல்",
    duplicateDetectionSubtitle: "ஒன்றுடன் ஒன்று பொருந்தும் சர்வே எண்கள் மற்றும் இரட்டை பதிவு முயற்சிகளை கண்டறிக",
    similarityScore: "ஒப்பீட்டு மதிப்பெண்",
    matchedFields: "பொருந்திய புலங்கள்",
    comparedDocuments: "முரண்பட்ட ஆவணங்களை ஒப்பிடுக",
    investigateDuplicate: "முரண்பாட்டை விசாரி",
    confirmFraud: "மோசடி ஆவணமாக உறுதிசெய்",
    dismissDuplicate: "தள்ளுபடி செய் (முறையான பரிமாற்றம்)",
    duplicateResolutionRemarks: "தீர்வு கருத்துக்கள்",

    mockAadhaarTitle: "மாதிரி ஆதார் அடையாள சரிபார்ப்பு (KYC)",
    mockAadhaarSubtitle: "மாதிரி ஆதார் கணக்குகள் மற்றும் உடனடி OTP மூலம் அடையாளத்தை சரிபார்க்கவும்",
    enter12DigitAadhaar: "12-இலக்க ஆதார் எண்ணை உள்ளிடவும்",
    requestOTP: "மாதிரி OTP கோருக",
    enter6DigitOTP: "6-இலக்க OTP எண்ணை உள்ளிடவும்",
    verifyOTP: "அடையாளத்தை சரிபார்",
    kycVerifiedSuccess: "அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது",
    syntheticDemoAccounts: "முன் கட்டமைக்கப்பட்ட மாதிரி குடிமக்கள்",
    useDemoProfile: "இந்த விவரக்குறிப்பை பயன்படுத்து",

    storageVaultTitle: "எனது பாதுகாப்பான பெட்டகம் (1GB இலவச இடம்)",
    storageVaultSubtitle: "பட்டா மற்றும் வரி ரசீதுகளை AES-256 GCM மிலிட்டரி குறியாக்கத்துடன் சேமிக்கவும்",
    quotaUsage: "சேமிப்பக ஒதுக்கீட்டு பயன்பாடு",
    vaultFolderCategories: "பெட்டக கோப்புறைகள்",
    uploadToVault: "கோப்பை பெட்டகத்தில் பதிவேற்று",
    folderCategory: "கோப்புறை வகை",
    encryptedWithAES256: "AES-256 GCM மூலம் குறியாக்கம் செய்யப்பட்டது",
    downloadDecryptedFile: "குறியாக்கம் நீக்கப்பட்ட கோப்பை பதிவிறக்கு",

    disputesTitle: "நில தகராறு & எல்லை புகார் தீர்வு",
    disputesSubtitle: "எல்லை ஆக்கிரமிப்பு புகார்களை பதிவு செய்யவும், விசாரணை தேதிகளை கண்காணிக்கவும்",
    fileNewDispute: "புதிய நிலப் புகாரை பதிவு செய்",
    disputeCategory: "புகார் வகை",
    encroachmentDetails: "எல்லை ஆக்கிரமிப்பு விவரம்",
    uploadEvidenceDocuments: "சான்றாவணங்களை பதிவேற்றவும்",
    scheduledHearingDate: "விசாரணை நாள்",
    resolutionSummary: "வருவாய் அலுவலர் தீர்வு அறிக்கை",

    auditLogsTitle: "அமைப்பு தணிக்கை பதிவுகள் & குறியாக்க சங்கிலி",
    auditLogsSubtitle: "பதிவேற்றங்கள், சரிபார்ப்புகள் மற்றும் முடிவுகளை பதிவு செய்யும் மாற்ற முடியாத தணிக்கை சங்கிலி",
    blockchainIntegrityChain: "குறியாக்க தணிக்கை சங்கிலி",
    blockHash: "SHA-256 பிளாக் ஹாஷ்",
    previousHash: "முந்தைய ஹாஷ்",
    actor: "செயல் புரிந்தவர் / அலுவலர்",
    ipAddress: "IP முகவரி",
    eventAction: "நிகழ்வு செயல்",
    tamperIntegrityVerified: "100% நம்பகத்தன்மை சரிபார்க்கப்பட்டது",
    fraudReviewTitle: "AI மோசடி & டிஜிட்டல் சேத தடயவியல்",
    fraudReviewSubtitle: "எழுத்துரு முரண்பாடுகள் மற்றும் மெட்டாடேட்டா மாற்றங்களை ஆய்வு செய்க",

    profileTitle: "பயனர் சுயவிவரம் & பாதுகாப்பு அமைப்புகள்",
    profileSubtitle: "உங்கள் கணக்கு விவரங்கள், கடவுச்சொல் மற்றும் மொழி விருப்பங்களை நிர்வகிக்கவும்",
    personalInformation: "தனிப்பட்ட விவரங்கள்",
    accountSecurity: "பாதுகாப்பு & சான்றுகள்",
    changePasswordTitle: "கடவுச்சொல்லை மாற்றவும்",
    currentPassword: "தற்போதைய கடவுச்சொல்",
    newPassword: "புதிய கடவுச்சொல்",
    confirmNewPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்துக",
    preferredLanguage: "தளத்தின் மொழி",

    aiAssistant: "டிஜிலாண்ட் AI உதவியாளர்",
    askAssistant: "பட்டா, புல எண் அல்லது சரிபார்ப்பு பற்றி கேளுங்கள்...",
    listeningVoice: "குரல் உள்ளீட்டை கேட்கிறது...",
    speakQuestion: "உங்கள் கேள்வியை தெளிவாக பேசவும்",
    stopVoice: "குரலை நிறுத்து",
    voiceSynchronized: "குரல் ஒருங்கிணைக்கப்பட்டது • 6 மொழிகள்"
  },
  hi: {
    brandName: "डिजीलैंड",
    brandTagline: "एआई-संचालित डिजिटल भू-अभिलेख प्रबंधन प्रणाली",
    officialGovtPortal: "आधिकारिक भूमि प्रशासन और राजस्व पोर्टल",
    allRightsReserved: "भारत सरकार। सर्वाधिकार सुरक्षित।",
    tamperProofBlockchainProtected: "SHA-256 छेड़छाड़-रोधी ऑडिट चेन द्वारा सुरक्षित",
    languageName: "हिन्दी",

    save: "सहेजें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    view: "देखें",
    download: "डाउनलोड",
    upload: "अपलोड",
    search: "खोजें",
    filter: "फ़िल्टर",
    clear: "साफ़ करें",
    reset: "रीसेट करें",
    retry: "पुनः प्रयास करें",
    close: "बंद करें",
    confirm: "पुष्टि करें",
    back: "वापस",
    next: "आगे",
    open: "खोलें",
    refresh: "ताज़ा करें",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया!",
    actions: "कार्रवाई",
    status: "स्थिति",
    date: "दिनांक",
    details: "विवरण",
    loading: "लोड हो रहा है...",
    processing: "प्रक्रिया जारी है...",
    pleaseWait: "कृपया प्रतीक्षा करें...",
    noData: "कोई डेटा उपलब्ध नहीं",
    noResultsFound: "कोई रिकॉर्ड नहीं मिला",
    all: "सभी",
    yes: "हाँ",
    no: "नहीं",
    viewDetails: "विवरण देखें",
    viewReport: "एआई रिपोर्ट देखें",
    downloadCertificate: "प्रमाणपत्र डाउनलोड करें",
    learnMore: "और जानें",

    statusVerified: "सत्यापित",
    statusPending: "लंबित",
    statusRejected: "अस्वीकृत",
    statusVerificationRequired: "सत्यापन आवश्यक",
    statusCorrectionRequested: "सुधार का अनुरोध",
    statusDuplicateSuspected: "संदिग्ध डुप्लिकेट",
    statusUnderReview: "समीक्षाधीन",
    statusFlaggedByOfficer: "अधिकारी द्वारा चिह्नित",
    statusDismissed: "खारिज किया गया",
    statusConfirmedFraud: "धोखाधड़ी की पुष्टि",
    statusNeedsReview: "समीक्षा की आवश्यकता",
    statusSubmitted: "प्रस्तुत किया गया",
    statusResolved: "हल किया गया",
    statusActive: "सक्रिय",
    statusCompleted: "पूर्ण",
    statusFailed: "विफल",
    statusEscalated: "वरिष्ठ अधिकारी को भेजा गया",

    login: "साइन इन",
    register: "पंजीकरण करें",
    logout: "साइन आउट",
    dashboard: "डैशबोर्ड",
    myDocuments: "मेरे दस्तावेज़",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    scanDocument: "दस्तावेज़ स्कैन करें",
    updateDocument: "दस्तावेज़ अपडेट करें",
    downloadDocument: "दस्तावेज़ डाउनलोड करें",
    landSearch: "भूमि खोज",
    gisMap: "जीआईएस पार्सल मानचित्र",
    verificationStatus: "सत्यापन स्थिति",
    notifications: "सूचनाएं",
    profile: "उपयोगकर्ता प्रोफ़ाइल",
    auditHistory: "ऑडिट इतिहास",
    mySecureStorage: "सुरक्षित स्टोरेज वॉल्ट",
    identityVerification: "आधार सत्यापन",
    disputes: "भूमि विवाद",
    citizenRecords: "नागरिक अभिलेख",
    documentVerification: "दस्तावेज़ सत्यापन",
    ocrReview: "ओसीआर समीक्षा",
    dataValidation: "डेटा सत्यापन",
    duplicateDetection: "डुप्लिकेट पहचान",
    fraudReviewQueue: "धोखाधड़ी समीक्षा कतार",
    officerDisputes: "विवाद निवारण",
    auditLogs: "सिस्टम ऑडिट लॉग",
    roleCitizen: "नागरिक पोर्टल",
    roleOfficer: "सरकारी अधिकारी पोर्टल",
    roleAdmin: "राजस्व व्यवस्थापक पोर्टल",
    viewAll: "सभी देखें",
    markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
    noNotifications: "कोई नई सूचना नहीं",

    signInTitle: "डिजीलैंड में साइन इन करें",
    signInSubtitle: "अपने सत्यापित डिजिटल भूमि अभिलेख और राजस्व सेवाओं का उपयोग करें",
    registerTitle: "डिजीलैंड खाता बनाएं",
    registerSubtitle: "सीधे भूमि स्वामित्व और सत्यापन सेवाओं के लिए पंजीकरण करें",
    emailOrPhone: "ईमेल पता या फोन नंबर",
    emailAddress: "ईमेल पता",
    phoneNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    fullName: "पूरा नाम",
    age: "आयु",
    selectRole: "पोर्टल भूमिका चुनें",
    forgotPassword: "पासवर्ड भूल गए?",
    forgotPasswordTitle: "पासवर्ड रीसेट करें",
    forgotPasswordSubtitle: "पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें",
    sendResetLink: "रीसेट लिंक भेजें",
    backToSignIn: "साइन इन पर वापस जाएं",
    alreadyHaveAccount: "पहले से खाता है? साइन इन करें",
    dontHaveAccount: "नए उपयोगकर्ता? खाता बनाएं",
    demoCredentials: "त्वरित डेमो क्रेडेंशियल",
    loginAsCitizen: "नागरिक के रूप में लॉगिन करें",
    loginAsOfficer: "राजस्व अधिकारी के रूप में लॉगिन करें",
    invalidCredentials: "अमान्य ईमेल/फोन या पासवर्ड।",
    passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते।",
    accountCreatedSuccess: "खाता सफलतापूर्वक पंजीकृत! अब आप साइन इन कर सकते हैं।",

    welcomeBack: "वापसी पर स्वागत है",
    portalOverview: "भूमि प्रशासन डैशबोर्ड अवलोकन",
    totalDocuments: "कुल दस्तावेज़",
    processingDocuments: "प्रक्रियाधीन",
    verifiedRecords: "सत्यापित अभिलेख",
    pendingVerification: "सत्यापन लंबित",
    issuesDetected: "त्रुटियाँ पाई गईं",
    recentDocuments: "हाल के दस्तावेज़",
    recentActivity: "हाल की गतिविधि",
    verificationProgress: "सत्यापन प्रगति दर",
    quickActions: "त्वरित कार्रवाई",
    requiresHumanVerification: "मानव सत्यापन आवश्यक",
    potentialDuplicateDetected: "संभावित डुप्लिकेट रिकॉर्ड पाया गया",
    activeDisputes: "सक्रिय भूमि विवाद",
    systemIntegrityStatus: "सुरक्षा और हैश अखंडता",
    verifiedIntegrityDesc: "सभी रिकॉर्ड क्रिप्टोग्राफ़िक हैश चेनिंग से सुरक्षित हैं।",

    landSearchTitle: "कैडस्ट्रल भूमि खोज",
    landSearchSubtitle: "प्रशासनिक पदानुक्रम और खसरा/सर्वे संख्या द्वारा भूमि खोजें",
    cascadingLocationFilter: "स्थान फ़िल्टर",
    selectState: "राज्य चुनें",
    selectDistrict: "ज़िला चुनें",
    selectTaluk: "तहसील चुनें",
    selectVillage: "राजस्व ग्राम चुनें",
    district: "ज़िला",
    taluk: "तहसील",
    village: "ग्राम",
    surveyNumber: "खसरा / सर्वे संख्या",
    pattaNumber: "पट्टा संख्या",
    khasraNumber: "खसरा संख्या",
    ownerName: "भू-स्वामी का नाम",
    searchByParameters: "भूमि अभिलेख खोजें",
    matchingLandRecords: "समान भूमि पार्सल",
    parcelDetails: "भूमि पार्सल विवरण",
    extentArea: "क्षेत्रफल और माप",
    landClassification: "भूमि वर्गीकरण",
    subdivision: "उप-विभाजन संख्या",
    viewOnMap: "GIS मानचित्र पर देखें",
    gisCadastralViewer: "GIS पार्सल मानचित्र दर्शक",
    mapLayers: "मानचित्र परतें",
    zoomIn: "ज़ूम इन",
    zoomOut: "ज़ूम आउट",

    documentNumber: "दस्तावेज़ संख्या",
    documentTitle: "दस्तावेज़ शीर्षक",
    documentType: "दस्तावेज़ का प्रकार",
    fileSize: "फ़ाइल का आकार",
    version: "संस्करण",
    uploadedOn: "अपलोड की तारीख",
    verifiedOn: "सत्यापन की तारीख",
    dragAndDropFiles: "यहाँ अपना भूमि दस्तावेज़ PDF खींचें और छोड़ें",
    orBrowseFiles: "या अपने कंप्यूटर से फ़ाइल चुनें",
    supportedFormats: "समर्थित प्रारूप: PDF, JPEG, PNG (अधिकतम 25MB)",
    maxFileSize: "अधिकतम आकार: 25MB",
    uploadNewVersion: "नया संस्करण अपलोड करें",
    reasonForUpdate: "संशोधन का कारण",
    deleteDocumentTitle: "दस्तावेज़ हटाएं",
    deleteDocumentConfirm: "क्या आप वाकई इस दस्तावेज़ को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
    passwordProtectedUnlockInfo: "पासवर्ड-संरक्षित प्रमाणपत्र",
    passwordFormulaExplanation: "डाउनलोड किया गया प्रमाणपत्र एन्क्रिप्टेड है। अनलॉक सूत्र: खसरा संख्या (बिना स्लैश) + मालिक का पहला नाम बड़े अक्षरों में।",
    testPassword: "पासवर्ड परीक्षण",
    unlockFormulaExample: "उदाहरण: 142/3A + Ramasamy -> 1423ARAMASAMY",

    cameraScannerTitle: "मल्टी-पेज कैमरा स्कैनर और ओसीआर",
    cameraScannerSubtitle: "कैमरे से भौतिक दस्तावेज़ स्कैन करें और 17 विवरण तुरंत प्राप्त करें",
    startCamera: "कैमरा शुरू करें",
    stopCamera: "कैमरा बंद करें",
    capturePage: "पेज कैप्चर करें",
    retakePage: "पुनः कैप्चर करें",
    switchCamera: "कैमरा बदलें",
    scannedPages: "स्कैन किए गए पेज",
    addPage: "अन्य पेज जोड़ें",
    removePage: "पेज हटाएं",
    compileAndRunOCR: "दस्तावेज़ संकलित करें और OCR चलाएं",
    imageQualityScore: "छवि गुणवत्ता स्कोर",
    ocrConfidence: "OCR सटीकता स्तर",
    extracted17Fields: "निष्कर्षित 17 भू-अभिलेख विवरण",
    fieldLabel: "फ़ील्ड नाम",
    extractedValue: "निष्कर्षित मान",
    confidenceScore: "सटीकता",
    verifiedByOfficer: "अधिकारी द्वारा सत्यापित",

    verificationQueueTitle: "अधिकारी दस्तावेज़ सत्यापन कतार",
    verificationQueueSubtitle: "भूमि अनुसूची का निरीक्षण करें, AI फोरेंसिक जांचें और डिजिटल निर्णय लें",
    splitScreenReview: "स्प्लिट-स्क्रीन दस्तावेज़ समीक्षा",
    originalDeedPreview: "मूल दस्तावेज़ पूर्वावलोकन",
    extractedScheduleComparison: "निष्कर्षित अनुसूची बनाम सरकारी रिकॉर्ड",
    officerDecision: "अधिकारी का निर्णय",
    approveDeed: "स्वीकृत करें (सत्यापित प्रमाणपत्र जारी करें)",
    rejectDeed: "अस्वीकृत करें",
    requestCorrection: "नागरिक से सुधार का अनुरोध करें",
    markAsDuplicate: "डुप्लिकेट के रूप में चिह्नित करें",
    officerRemarks: "आधिकारिक टिप्पणियाँ",
    correctionInstructions: "सुधार निर्देश",
    approvalHistory: "अनुमोदन इतिहास",
    decisionSubmittedSuccess: "सत्यापन निर्णय सफलतापूर्वक दर्ज किया गया।",

    aiReviewTitle: "एआई दस्तावेज़ समीक्षा और विश्लेषण",
    aiReviewSubtitle: "स्वचालित वर्गीकरण, 17-फ़ील्ड विश्लेषण, डुप्लिकेट ओवरलैप और छेड़छाड़ जोखिम स्कोरिंग",
    overallAIScore: "समग्र एआई स्कोर",
    qualityGrade: "गुणवत्ता ग्रेड",
    compulsoryOfficerInspection: "अनिवार्य अधिकारी निरीक्षण",
    ruleValidationChecks: "नियम सत्यापन जांच",
    inconsistenciesDetected: "विसंगतियाँ पाई गईं",
    duplicateOverlapRisk: "डुप्लिकेट और सीमा ओवरलैप जोखिम",
    digitalImageForensics: "छवि फोरेंसिक और छेड़छाड़ जोखिम",
    tamperRiskScore: "छेड़छाड़ जोखिम स्कोर",
    officerRecommendations: "अधिकारी के लिए सिफ़ारिशें",
    regenerateAIReview: "AI विश्लेषण पुनः चलाएं",
    aiDisclaimer: "एआई समीक्षा अधिकारियों की सहायता के लिए तैयार की गई है। अंतिम कानूनी अधिकार तहसीलदार का है।",

    duplicateDetectionTitle: "डुप्लिकेट और सीमा ओवरलैप पहचान",
    duplicateDetectionSubtitle: "अतिव्यापी सर्वे नंबर और दोहरे पंजीकरण के प्रयासों की पहचान करें",
    similarityScore: "समानता स्कोर",
    matchedFields: "मेल खाती फ़ील्ड्स",
    comparedDocuments: "विरोधी दस्तावेज़ों की तुलना करें",
    investigateDuplicate: "विवाद की जांच करें",
    confirmFraud: "धोखाधड़ी के रूप में पुष्टि करें",
    dismissDuplicate: "खारिज करें (वैध हस्तांतरण)",
    duplicateResolutionRemarks: "समाधान टिप्पणी",

    mockAadhaarTitle: "मॉक आधार पहचान सत्यापन (KYC)",
    mockAadhaarSubtitle: "डेमो आधार प्रोफाइल और तत्काल ओटीपी के साथ पहचान सत्यापन का अनुकरण करें",
    enter12DigitAadhaar: "12-अंकों का आधार नंबर दर्ज करें",
    requestOTP: "डेमो ओटीपी का अनुरोध करें",
    enter6DigitOTP: "6-अंकों का ओटीपी दर्ज करें",
    verifyOTP: "पहचान सत्यापित करें",
    kycVerifiedSuccess: "पहचान सफलतापूर्वक सत्यापित",
    syntheticDemoAccounts: "पूर्व-कॉन्फ़िगर किए गए डेमो नागरिक",
    useDemoProfile: "इस प्रोफ़ाइल का उपयोग करें",

    storageVaultTitle: "सुरक्षित स्टोरेज वॉल्ट (1GB मुफ़्त जगह)",
    storageVaultSubtitle: "सैन्य-ग्रेड AES-256 GCM एन्क्रिप्शन के साथ अपने पट्टे और कर रसीदें सुरक्षित रखें",
    quotaUsage: "स्टोरेज उपयोग",
    vaultFolderCategories: "वॉल्ट फ़ोल्डर",
    uploadToVault: "वॉल्ट में फ़ाइल अपलोड करें",
    folderCategory: "फ़ोल्डर श्रेणी",
    encryptedWithAES256: "AES-256 GCM एन्क्रिप्टेड",
    downloadDecryptedFile: "डिक्रिप्टेड फ़ाइल डाउनलोड करें",

    disputesTitle: "भूमि विवाद और शिकायत निवारण",
    disputesSubtitle: "सीमा अतिक्रमण शिकायतें दर्ज करें और सुनवाई की तारीखों को ट्रैक करें",
    fileNewDispute: "नई शिकायत दर्ज करें",
    disputeCategory: "विवाद श्रेणी",
    encroachmentDetails: "सीमा अतिक्रमण का विवरण",
    uploadEvidenceDocuments: "साक्ष्य दस्तावेज़ अपलोड करें",
    scheduledHearingDate: "सुनवाई की तारीख",
    resolutionSummary: "राजस्व अधिकारी समाधान सारांश",

    auditLogsTitle: "सिस्टम ऑडिट लॉग और ब्लॉकचेन हैश चेन",
    auditLogsSubtitle: "प्रत्येक दस्तावेज़ अपलोड, सत्यापन और निर्णय को रिकॉर्ड करने वाली सुरक्षित खाता बही",
    blockchainIntegrityChain: "क्रिप्टोग्राफ़िक ऑडिट चेन",
    blockHash: "SHA-256 ब्लॉक हैश",
    previousHash: "पिछला हैश",
    actor: "उपयोगकर्ता / अधिकारी",
    ipAddress: "आईपी पता",
    eventAction: "इवेंट एक्शन",
    tamperIntegrityVerified: "100% हैश अखंडता सत्यापित",
    fraudReviewTitle: "AI धोखाधड़ी और डिजिटल छेड़छाड़ फोरेंसिक",
    fraudReviewSubtitle: "फ़ॉन्ट विसंगतियों और मेटाडेटा परिवर्तनों का विश्लेषण करें",

    profileTitle: "उपयोगकर्ता प्रोफ़ाइल और सुरक्षा सेटिंग्स",
    profileSubtitle: "अपनी प्रोफ़ाइल, सुरक्षा क्रेडेंशियल्स और पसंदीदा भाषा प्रबंधित करें",
    personalInformation: "व्यक्तिगत जानकारी",
    accountSecurity: "सुरक्षा और क्रेडेंशियल",
    changePasswordTitle: "पासवर्ड बदलें",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
    preferredLanguage: "पोर्टल भाषा",

    aiAssistant: "डिजीलैंड एआई सहायक",
    askAssistant: "पट्टा, खसरा, या सत्यापन के बारे में पूछें...",
    listeningVoice: "आवाज़ सुनी जा रही है...",
    speakQuestion: "अपना प्रश्न स्पष्ट रूप से बोलें",
    stopVoice: "आवाज़ बंद करें",
    voiceSynchronized: "ध्वनि सिंक्रनाइज़ • 6 भाषाएं"
  },
  te: {
    brandName: "డిజిల్యాండ్",
    brandTagline: "AI ఆధారిత డిజిటల్ భూ రికార్డు నిర్వహణ వ్యవస్థ",
    officialGovtPortal: "అధికారిక భూ పరిపాలన & రెవెన్యూ పోర్టల్",
    allRightsReserved: "భారత ప్రభుత్వం. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.",
    tamperProofBlockchainProtected: "SHA-256 ఆడిట్ చైన్ ద్వారా రక్షించబడింది",
    languageName: "తెలుగు",

    save: "భద్రపరచు",
    cancel: "రద్దు చేయి",
    submit: "సమర్పించు",
    delete: "తొలగించు",
    edit: "సవరించు",
    view: "చూడండి",
    download: "డౌన్‌లోడ్",
    upload: "అప్‌లోడ్",
    search: "శోధించండి",
    filter: "వడపోత",
    clear: "తుడిచివేయి",
    reset: "రీసెట్",
    retry: "మళ్ళీ ప్రయత్నించండి",
    close: "మూసివేయి",
    confirm: "ధృవీకరించండి",
    back: "వెనుకకు",
    next: "తరువాత",
    open: "తెరవండి",
    refresh: "రిఫ్రెష్",
    copy: "కాపీ",
    copied: "కాపీ చేయబడింది!",
    actions: "చర్యలు",
    status: "స్థితి",
    date: "తేదీ",
    details: "వివరాలు",
    loading: "లోడ్ అవుతోంది...",
    processing: "ప్రాసెస్ అవుతోంది...",
    pleaseWait: "దయచేసి వేచి ఉండండి...",
    noData: "సమాచారం అందుబాటులో లేదు",
    noResultsFound: "ఎలాంటి ఫలితాలు లభించలేదు",
    all: "అన్నీ",
    yes: "అవును",
    no: "కాదు",
    viewDetails: "వివరాలు చూడండి",
    viewReport: "AI నివేదిక చూడండి",
    downloadCertificate: "సర్టిఫికెట్ డౌన్‌లోడ్",
    learnMore: "మరింత తెలుసుకోండి",

    statusVerified: "ధృవీకరించబడింది",
    statusPending: "సమీక్షలో ఉంది",
    statusRejected: "తిరస్కరించబడింది",
    statusVerificationRequired: "ధృవీకరణ అవసరం",
    statusCorrectionRequested: "సవరణ కోరబడింది",
    statusDuplicateSuspected: "డూప్లికేట్ అనుమానం",
    statusUnderReview: "పరిశీలనలో ఉంది",
    statusFlaggedByOfficer: "అధికారి ద్వారా ఫ్లాగ్ చేయబడింది",
    statusDismissed: "కొట్టివేయబడింది",
    statusConfirmedFraud: "మోసపూరితమైనదిగా నిర్ధారించబడింది",
    statusNeedsReview: "సమీక్ష అవసరం",
    statusSubmitted: "సమర్పించబడింది",
    statusResolved: "పరిష్కరించబడింది",
    statusActive: "యాక్టివ్",
    statusCompleted: "పూర్తయింది",
    statusFailed: "విఫలమైంది",
    statusEscalated: "ఉన్నతాధికారికి పంపబడింది",

    login: "సైన్ ఇన్",
    register: "నమోదు చేసుకోండి",
    logout: "లాగ్ అవుట్",
    dashboard: "డాష్‌బోర్డ్",
    myDocuments: "నా పత్రాలు",
    uploadDocument: "పత్రం అప్‌లోడ్ చేయండి",
    scanDocument: "పత్రం స్కాన్ చేయండి",
    updateDocument: "పత్రం నవీకరించండి",
    downloadDocument: "పత్రం డౌన్‌లోడ్ చేయండి",
    landSearch: "భూమి శోధన",
    gisMap: "GIS పార్సెల్ మ్యాప్",
    verificationStatus: "ధృవీకరణ స్థితి",
    notifications: "నోటిఫికేషన్లు",
    profile: "యూజర్ ప్రొఫైల్",
    auditHistory: "ఆడిట్ చరిత్ర",
    mySecureStorage: "సురక్షిత నిல்వ వాల్ట్",
    identityVerification: "ఆధార్ ధృవీకరణ",
    disputes: "భూ వివాదాలు",
    citizenRecords: "పౌర రికార్డులు",
    documentVerification: "పత్ర ధృవీకరణ",
    ocrReview: "OCR సమీక్ష",
    dataValidation: "డేటా ధృవీకరణ",
    duplicateDetection: "డూప్లికేట్ గుర్తింపు",
    fraudReviewQueue: "మోసం సమీక్ష క్యూ",
    officerDisputes: "వివాదాల పరిష్కారం",
    auditLogs: "సిస్టమ్ ఆడిట్ లాగ్‌లు",
    roleCitizen: "పౌర పోర్టల్",
    roleOfficer: "ప్రభుత్వ అధికారి పోర్టల్",
    roleAdmin: "రెవెన్యూ అడ్మిన్ పోర్టల్",
    viewAll: "అన్నీ చూడండి",
    markAllRead: "అన్నీ చదివినట్లు గుర్తించు",
    noNotifications: "కొత్త నోటిఫికేషన్లు లేవు",

    signInTitle: "డిజిల్యాండ్‌కి సైన్ ఇన్ చేయండి",
    signInSubtitle: "మీ ధృవీకరించబడిన భూ రికార్డులు మరియు సేవలను యాక్సెస్ చేయండి",
    registerTitle: "డిజిల్యాండ్ ఖాతాను సృష్టించండి",
    registerSubtitle: "ప్రత్యక్ష భూ యాజమాన్య సేవల కోసం నమోదు చేసుకోండి",
    emailOrPhone: "ఈమెయిల్ లేదా ఫోన్ నంబర్",
    emailAddress: "ఈమెయిల్ చిరునామా",
    phoneNumber: "మొబైల్ నంబర్",
    password: "పాస్‌వర్డ్",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
    fullName: "పూర్తి పేరు",
    age: "వయస్సు",
    selectRole: "పోర్టల్ పాత్రను ఎంచుకోండి",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    forgotPasswordTitle: "పాస్‌వర్డ్ రీసెట్ చేయండి",
    forgotPasswordSubtitle: "రీసెట్ లింక్ పొందడానికి మీ ఈమెయిల్ నమోదు చేయండి",
    sendResetLink: "రీసెట్ లింక్ పంపండి",
    backToSignIn: "సైన్ ఇన్ కి తిరిగి వెళ్ళండి",
    alreadyHaveAccount: "ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
    dontHaveAccount: "కొత్త యూజరా? ఖాతా సృష్టించండి",
    demoCredentials: "డెమో లాగిన్ వివరాలు",
    loginAsCitizen: "పౌరుడిగా లాగిన్ అవ్వండి",
    loginAsOfficer: "రెవెన్యూ అధికారిగా లాగిన్ అవ్వండి",
    invalidCredentials: "చెల్లని వివరాలు లేదా పాస్‌వర్డ్.",
    passwordsDoNotMatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
    accountCreatedSuccess: "ఖాతా విజయవంతంగా సృష్టించబడింది! ఇప్పుడు సైన్ ఇన్ చేయవచ్చు.",

    welcomeBack: "స్వాగతం",
    portalOverview: "భూ పరిపాలన డాష్‌బోర్డ్ వివరణ",
    totalDocuments: "మొత్తం పత్రాలు",
    processingDocuments: "ప్రాసెసింగ్",
    verifiedRecords: "ధృవీకరించిన రికార్డులు",
    pendingVerification: "ధృవీకరణ పెండింగ్‌లో ఉంది",
    issuesDetected: "గుర్తించిన లోపాలు",
    recentDocuments: "ఇటీవలి పత్రాలు",
    recentActivity: "ఇటీవలి కార్యాచరణ",
    verificationProgress: "ధృవీకరణ రేటు",
    quickActions: "త్వరిత చర్యలు",
    requiresHumanVerification: "అధికారి సమీక్ష అవసరం",
    potentialDuplicateDetected: "డూప్లికేట్ పత్రం గుర్తించబడింది",
    activeDisputes: "సక్రియ భూ వివాదాలు",
    systemIntegrityStatus: "భద్రత & సమగ్రత",
    verifiedIntegrityDesc: "అన్ని రికార్డులు హాష్ చైనింగ్‌తో రక్షించబడ్డాయి.",

    landSearchTitle: "భూమి శోధన",
    landSearchSubtitle: "సర్వే నంబర్ మరియు ప్రాంతాల వారీగా భూమిని శోధించండి",
    cascadingLocationFilter: "ప్రాంతం ఫిల్టర్",
    selectState: "రాష్ట్రం ఎంచుకోండి",
    selectDistrict: "జిల్లా ఎంచుకోండి",
    selectTaluk: "తాలూకా ఎంచుకోండి",
    selectVillage: "గ్రామం ఎంచుకోండి",
    district: "జిల్లా",
    taluk: "తాలూకా",
    village: "గ్రామం",
    surveyNumber: "సర్వే నంబర్",
    pattaNumber: "పట్టా నంబర్",
    khasraNumber: "ఖస్రా నంబర్",
    ownerName: "భూ యజమాని పేరు",
    searchByParameters: "భూమి రికార్డులను శోధించండి",
    matchingLandRecords: "సరిపోలిన భూ పార్సెల్‌లు",
    parcelDetails: "భూమి వివరాలు",
    extentArea: "విస్తీర్ణం",
    landClassification: "వర్గీకరణ",
    subdivision: "సబ్‌డివిజన్ నంబర్",
    viewOnMap: "GIS మ్యాప్‌లో చూడండి",
    gisCadastralViewer: "GIS క్యాడస్ట్రల్ మ్యాప్ వ్యూయర్",
    mapLayers: "మ్యాప్ లేయర్‌లు",
    zoomIn: "జూమ్ ఇన్",
    zoomOut: "జూమ్ అవుట్",

    documentNumber: "పత్రం నంబర్",
    documentTitle: "పత్రం శీర్షిక",
    documentType: "పత్రం రకం",
    fileSize: "ఫైల్ సైజు",
    version: "వెర్షన్",
    uploadedOn: "అప్‌లోడ్ చేసిన తేదీ",
    verifiedOn: "ధృవీకరించిన తేదీ",
    dragAndDropFiles: "మీ PDF పత్రాన్ని ఇక్కడ లాగి వదలండి",
    orBrowseFiles: "లేదా ఫైల్ ఎంచుకోండి",
    supportedFormats: "మద్దతు గల ఫార్మాట్‌లు: PDF, JPEG, PNG (గరిష్టంగా 25MB)",
    maxFileSize: "గరిష్ట పరిమాణం: 25MB",
    uploadNewVersion: "కొత్త వెర్షన్ అప్‌లోడ్ చేయండి",
    reasonForUpdate: "నవీకరణకు కారణం",
    deleteDocumentTitle: "పత్రాన్ని తొలగించండి",
    deleteDocumentConfirm: "ఈ పత్రాన్ని తొలగించాలనుకుంటున్నారా? ఈ చర్యను రద్దు చేయలేరు.",
    passwordProtectedUnlockInfo: "పాస్‌వర్డ్ రక్షిత సర్టిఫికేట్",
    passwordFormulaExplanation: "సర్టిఫికేట్ పాస్‌వర్డ్ సూత్రం: సర్వే నంబర్ (స్లాష్‌లు లేకుండా) + యజమాని మొదటి పేరు క్యాపిటల్ లెటర్స్‌లో.",
    testPassword: "పాస్‌వర్డ్ పరీక్షించండి",
    unlockFormulaExample: "ఉదాహరణ: 142/3A + Ramasamy -> 1423ARAMASAMY",

    cameraScannerTitle: "మల్టీ-పేజీ కెమెరా స్కానర్ & OCR",
    cameraScannerSubtitle: "భౌతిక పత్రాలను స్కాన్ చేసి 17 భూ వివరాలను తక్షణమే పొందండి",
    startCamera: "కెమెరా ప్రారంభించండి",
    stopCamera: "కెమెరా ఆపండి",
    capturePage: "పేజీని క్యాప్చర్ చేయండి",
    retakePage: "మళ్ళీ తీయండి",
    switchCamera: "కెమెరా మార్చండి",
    scannedPages: "స్కాన్ చేసిన పేజీలు",
    addPage: "మరొక పేజీని జోడించండి",
    removePage: "పేజీని తొలగించండి",
    compileAndRunOCR: "పత్రాన్ని కంపైల్ చేసి OCR అమలు చేయండి",
    imageQualityScore: "చిత్ర నాణ్యత స్కోర్",
    ocrConfidence: "OCR ఖచ్చితత్వం",
    extracted17Fields: "వెలికితీసిన 17 భూ షెడ్యూల్ వివరాలు",
    fieldLabel: "వివరాల పేరు",
    extractedValue: "వెలికితీసిన విలువ",
    confidenceScore: "ఖచ్చితత్వం",
    verifiedByOfficer: "అధికారి ద్వారా ధృవీకరించబడింది",

    verificationQueueTitle: "అధికారి పత్ర ధృవీకరణ క్యూ",
    verificationQueueSubtitle: "భూ వివరాలను తనిఖీ చేసి, AI నివేదికను పరిశీలించి నిర్ణయం సమర్పించండి",
    splitScreenReview: "స్ప్లిట్ స్క్రీన్ సమీక్ష",
    originalDeedPreview: "అసలు పత్రం ప్రివ్యూ",
    extractedScheduleComparison: "వెలికితీసిన వివరాలు vs ప్రభుత్వ రికార్డు",
    officerDecision: "అధికారి నిర్ణయం",
    approveDeed: "ఆమోదించండి (సర్టిఫికెట్ జారీ చేయండి)",
    rejectDeed: "తిరస్కరించండి",
    requestCorrection: "సవరణ కోరండి",
    markAsDuplicate: "డూప్లికేట్‌గా గుర్తించండి",
    officerRemarks: "అధికారిక వ్యాఖ్యలు",
    correctionInstructions: "సవరణ సూచనలు",
    approvalHistory: "ఆమోద చరిత్ర",
    decisionSubmittedSuccess: "ధృవీకరణ నిర్ణయం విజయవంతంగా నమోదు చేయబడింది.",

    aiReviewTitle: "AI పత్ర సమీక్ష & విశ్లేషణ",
    aiReviewSubtitle: "ఆటోమేటెడ్ వర్గీకరణ, 17-ఫీల్డ్ విశ్లేషణ, డూప్లికేట్ గుర్తింపు మరియు నకిలీ ప్రమాద స్కోరింగ్",
    overallAIScore: "మొత్తం AI స్కోర్",
    qualityGrade: "నాణ్యత గ్రేడ్",
    compulsoryOfficerInspection: "తప్పనిసరి అధికారి తనిఖీ",
    ruleValidationChecks: "నిబంధనల ధృవీకరణ తనిఖీలు",
    inconsistenciesDetected: "గుర్తించబడిన లోపాలు",
    duplicateOverlapRisk: "డూప్లికేట్ & సరిహద్దు ఓవర్‌లాప్ ప్రమాదం",
    digitalImageForensics: "ఇమేజ్ ఫోరెన్సిక్స్ & ట్యాంపర్ రిస్క్",
    tamperRiskScore: "ట్యాంపరింగ్ రిస్క్ స్కోర్",
    officerRecommendations: "అధికారికి సిఫార్సులు",
    regenerateAIReview: "AI విశ్లేషణను మళ్లీ అమలు చేయండి",
    aiDisclaimer: "AI సమీక్ష అధికారులకు సహాయం చేయడానికి రూపొందించబడింది. తుది నిర్ణయం తహశీల్దార్‌దే.",

    duplicateDetectionTitle: "డూప్లికేట్ & సరిహద్దు ఓవర్‌లాప్ గుర్తింపు",
    duplicateDetectionSubtitle: "సర్వే నంబర్ల ఓవర్‌లాప్ మరియు డబుల్ రిజిస్ట్రేషన్ ప్రయత్నాలను గుర్తించండి",
    similarityScore: "పోలిక స్కోరు",
    matchedFields: "సరిపోలిన వివరాలు",
    comparedDocuments: "వివాదాస్పద పత్రాలను పోల్చండి",
    investigateDuplicate: "వివాదాన్ని పరిశోధించండి",
    confirmFraud: "మోసపూరితమైనదిగా నిర్ధారించండి",
    dismissDuplicate: "కొట్టివేయండి (చట్టబద్ధమైన బదిలీ)",
    duplicateResolutionRemarks: "పరిష్కార వ్యాఖ్యలు",

    mockAadhaarTitle: "మాక్ ఆధార్ ధృవీకరణ (KYC)",
    mockAadhaarSubtitle: "డెమో ప్రొఫైల్‌లు మరియు తక్షణ OTP ద్వారా గుర్తింపును ధృవీకరించండి",
    enter12DigitAadhaar: "12-అంకెల ఆధార్ నంబర్ నమోదు చేయండి",
    requestOTP: "డెమో OTP అభ్యర్థించండి",
    enter6DigitOTP: "6-అంకెల OTP నమోదు చేయండి",
    verifyOTP: "గుర్తింపును ధృవీకరించండి",
    kycVerifiedSuccess: "గుర్తింపు విజయవంతంగా ధృవీకరించబడింది",
    syntheticDemoAccounts: "డెమో పౌరుల జాబితా",
    useDemoProfile: "ఈ ప్రొఫైల్‌ను ఉపయోగించండి",

    storageVaultTitle: "నా సురక్షిత నిల్వ (1GB ఉచిత స్థలం)",
    storageVaultSubtitle: "మిలిటరీ-గ్రేడ్ AES-256 GCM ఎన్‌క్రిప్షన్‌తో మీ పట్టాలు మరియు రసీదులను భద్రపరచండి",
    quotaUsage: "నిల్వ వినియోగం",
    vaultFolderCategories: "వాల్ట్ ఫోల్డర్‌లు",
    uploadToVault: "వాల్ట్‌కి ఫైల్ అప్‌లోడ్ చేయండి",
    folderCategory: "ఫోల్డర్ వర్గం",
    encryptedWithAES256: "AES-256 GCM ఎన్‌క్రిప్టెడ్",
    downloadDecryptedFile: "డీక్రిప్ట్ చేసిన ఫైల్‌ను డౌన్‌లోడ్ చేయండి",

    disputesTitle: "భూ వివాదాలు & సరిహద్దు ఫిర్యాదులు",
    disputesSubtitle: "సరిహద్దు ఆక్రమణ ఫిర్యాదులను నమోదు చేయండి మరియు విచారణ తేదీలను ట్రాక్ చేయండి",
    fileNewDispute: "కొత్త ఫిర్యాదును నమోదు చేయండి",
    disputeCategory: "వివాద వర్గం",
    encroachmentDetails: "ఆక్రమణ వివరాలు",
    uploadEvidenceDocuments: "సాక్ష్య పత్రాలను అప్‌లోడ్ చేయండి",
    scheduledHearingDate: "విచారణ తేదీ",
    resolutionSummary: "రెవెన్యూ అధికారి పరిష్కార సారాంశం",

    auditLogsTitle: "సిస్టమ్ ఆడిట్ లాగ్‌లు & బ్లాక్‌చెయిన్ హాష్ చైన్",
    auditLogsSubtitle: "అన్ని అప్‌లోడ్‌లు, ధృవీకరణలు మరియు నిర్ణయాలను రికార్డ్ చేసే భద్రతా లేడ్జర్",
    blockchainIntegrityChain: "క్రిప్టోగ్రాఫిక్ ఆడిట్ చైన్",
    blockHash: "SHA-256 బ్లాక్ హాష్",
    previousHash: "మునుపటి హాష్",
    actor: "యూజర్ / అధికారి",
    ipAddress: "IP చిరునామా",
    eventAction: "ఈవెంట్ చర్య",
    tamperIntegrityVerified: "100% హాష్ సమగ్రత ధృవీకరించబడింది",
    fraudReviewTitle: "AI మోసం & డిజిటల్ ఫోరెన్సిక్స్",
    fraudReviewSubtitle: "ఫాంట్ లోపాలు మరియు మెటాడేటా మార్పులను విశ్లేషించండి",

    profileTitle: "యూజర్ ప్రొఫైల్ & భద్రతా సెట్టింగ్‌లు",
    profileSubtitle: "మీ వివరాలు, పాస్‌వర్డ్ మరియు భాషా ప్రాధాన్యతలను నిర్వహించండి",
    personalInformation: "వ్యక్తిగత సమాచారం",
    accountSecurity: "భద్రత & పాస్‌వర్డ్",
    changePasswordTitle: "పాస్‌వర్డ్ మార్చండి",
    currentPassword: "ప్రస్తుత పాస్‌వర్డ్",
    newPassword: "కొత్త పాస్‌వర్డ్",
    confirmNewPassword: "కొత్త పాస్‌వర్డ్ నిర్ధారించండి",
    preferredLanguage: "పోర్టల్ భాష",

    aiAssistant: "డిజిల్యాండ్ AI అసిస్టెంట్",
    askAssistant: "పట్టా, సర్వే నంబర్ లేదా ధృవీకరణ గురించి అడగండి...",
    listeningVoice: "వాయిస్ వింటోంది...",
    speakQuestion: "మీ ప్రశ్నను స్పష్టంగా మాట్లాడండి",
    stopVoice: "వాయిస్ ఆపండి",
    voiceSynchronized: "వాయిస్ సమకాలీకరించబడింది • 6 భాషలు"
  },
  kn: {
    brandName: "ಡಿಜಿಲ್ಯಾಂಡ್",
    brandTagline: "AI ಚಾಲಿತ ಡಿಜಿಟಲ್ ಭೂ ದಾಖಲೆ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ",
    officialGovtPortal: "ಅಧಿಕೃತ ಭೂ ಆಡಳಿತ ಮತ್ತು ಕಂದಾಯ ಪೋರ್ಟಲ್",
    allRightsReserved: "ಭಾರತ ಸರ್ಕಾರ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    tamperProofBlockchainProtected: "SHA-256 ಆಡಿಟ್ ಚೈನ್ ಮೂಲಕ ರಕ್ಷಿಸಲಾಗಿದೆ",
    languageName: "ಕನ್ನಡ",

    save: "ಉಳಿಸು",
    cancel: "ರದ್ದುಮಾಡು",
    submit: "ಸಲ್ಲಿಸು",
    delete: "ಅಳಿಸು",
    edit: "ತಿದ್ದು",
    view: "ನೋಡು",
    download: "ಡೌನ್‌ಲೋಡ್",
    upload: "ಅಪ್‌ಲೋಡ್",
    search: "ಹುಡುಕು",
    filter: "ಫಿಲ್ಟರ್",
    clear: "ತೆರವುಗೊಳಿಸು",
    reset: "ಮರುಹೊಂದಿಸು",
    retry: "ಮರುಪ್ರಯತ್ನಿಸು",
    close: "ಮುಚ್ಚು",
    confirm: "ದೃಢೀಕರಿಸು",
    back: "ಹಿಂದಕ್ಕೆ",
    next: "ಮುಂದೆ",
    open: "ತೆರೆ",
    refresh: "ರಿಫ್ರೆಶ್",
    copy: "ನಕಲಿಸು",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    actions: "ಕ್ರಿಯೆಗಳು",
    status: "ಸ್ಥಿತಿ",
    date: "ದಿನಾಂಕ",
    details: "ವಿವರಗಳು",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    processing: "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...",
    pleaseWait: "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...",
    noData: "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ",
    noResultsFound: "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    all: "ಎಲ್ಲಾ",
    yes: "ಹೌದು",
    no: "ಇಲ್ಲ",
    viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    viewReport: "AI ವರದಿ ವೀಕ್ಷಿಸಿ",
    downloadCertificate: "ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್",
    learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",

    statusVerified: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    statusPending: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    statusRejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
    statusVerificationRequired: "ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ",
    statusCorrectionRequested: "ತಿದ್ದುಪಡಿಗೆ ಕೋರಲಾಗಿದೆ",
    statusDuplicateSuspected: "ನಕಲಿ ಶಂಕೆ",
    statusUnderReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    statusFlaggedByOfficer: "ಅಧಿಕಾರಿಯಿಂದ ಗುರುತಿಸಲಾಗಿದೆ",
    statusDismissed: "ಖುಲಾಸೆಗೊಳಿಸಲಾಗಿದೆ",
    statusConfirmedFraud: "ವಂಚನೆ ದೃಢಪಟ್ಟಿದೆ",
    statusNeedsReview: "ಮರುಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ",
    statusSubmitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    statusResolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    statusActive: "ಸಕ್ರಿಯ",
    statusCompleted: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    statusFailed: "ವಿಫಲವಾಗಿದೆ",
    statusEscalated: "ಮೇಲಧಿಕಾರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ",

    login: "ಸೈನ್ ಇನ್",
    register: "ನೋಂದಾಯಿಸಿ",
    logout: "ಸೈನ್ ಔಟ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    myDocuments: "ನನ್ನ ದಾಖಲೆಗಳು",
    uploadDocument: "ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    scanDocument: "ದಾಖಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    updateDocument: "ದಾಖಲೆ ನವೀಕರಿಸಿ",
    downloadDocument: "ದಾಖಲೆ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    landSearch: "ಭೂಮಿ ಹುಡುಕಾಟ",
    gisMap: "GIS ಭೂ ನಕ್ಷೆ",
    verificationStatus: "ದೃಢೀಕರಣ ಸ್ಥಿತಿ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    profile: "ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್",
    auditHistory: "ಆಡಿಟ್ ಇತಿಹಾಸ",
    mySecureStorage: "ಸುರಕ್ಷಿತ ಸಂಗ್ರಹ ವಾಲ್ಟ್",
    identityVerification: "ಆಧಾರ್ ದೃಢೀಕರಣ",
    disputes: "ಭೂ ವಿವಾದಗಳು",
    citizenRecords: "ನಾಗರಿಕ ದಾಖಲೆಗಳು",
    documentVerification: "ದಾಖಲೆ ದೃಢೀಕರಣ",
    ocrReview: "OCR ಪರಿಶೀಲನೆ",
    dataValidation: "ಡೇಟಾ ದೃಢೀಕರಣ",
    duplicateDetection: "ನಕಲಿ ದಾಖಲೆ ಪತ್ತೆ",
    fraudReviewQueue: "ವಂಚನೆ ಪರಿಶೀಲನಾ ಸರತಿ",
    officerDisputes: "ವಿವಾದ ಪರಿಹಾರ",
    auditLogs: "ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
    roleCitizen: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    roleOfficer: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    roleAdmin: "ಕಂದಾಯ ಆಡಳಿತ ಪೋರ್ಟಲ್",
    viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    markAllRead: "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    noNotifications: "ಯಾವುದೇ ಹೊಸ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ",

    signInTitle: "ಡಿಜಿಲ್ಯಾಂಡ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
    signInSubtitle: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಭೂ ದಾಖಲೆಗಳು ಮತ್ತು ಸೇವೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ",
    registerTitle: "ಡಿಜಿಲ್ಯಾಂಡ್ ಖಾತೆ ರಚಿಸಿ",
    registerSubtitle: "ಭೂ ಮಾಲೀಕತ್ವ ಮತ್ತು ದೃಢೀಕರಣ ಸೇವೆಗಳಿಗಾಗಿ ನೋಂದಾಯಿಸಿ",
    emailOrPhone: "ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    emailAddress: "ಇಮೇಲ್ ವಿಳಾಸ",
    phoneNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    age: "ವಯಸ್ಸು",
    selectRole: "ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
    forgotPasswordTitle: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
    forgotPasswordSubtitle: "ರೀಸೆಟ್ ಲಿಂಕ್ ಪಡೆಯಲು ಇಮೇಲ್ ನಮೂದಿಸಿ",
    sendResetLink: "ರೀಸೆಟ್ ಲಿಂಕ್ ಕಳುಹಿಸಿ",
    backToSignIn: "ಸೈನ್ ಇನ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಸೈನ್ ಇನ್ ಮಾಡಿ",
    dontHaveAccount: "ಹೊಸ ಬಳಕೆದಾರರೇ? ಖಾತೆ ರಚಿಸಿ",
    demoCredentials: "ಡೆಮೊ ಲಾಗಿನ್ ವಿವರಗಳು",
    loginAsCitizen: "ನಾಗರಿಕರಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ",
    loginAsOfficer: "ಕಂದಾಯ ಅಧಿಕಾರಿಯಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ",
    invalidCredentials: "ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.",
    passwordsDoNotMatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    accountCreatedSuccess: "ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ!",

    welcomeBack: "ಮರಳಿ ಸ್ವಾಗತ",
    portalOverview: "ಭೂ ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅವಲೋಕನ",
    totalDocuments: "ಒಟ್ಟು ದಾಖಲೆಗಳು",
    processingDocuments: "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
    verifiedRecords: "ದೃಢೀಕೃತ ದಾಖಲೆಗಳು",
    pendingVerification: "ದೃಢೀಕರಣ ಬಾಕಿಯಿದೆ",
    issuesDetected: "ದೋಷಗಳು ಕಂಡುಬಂದಿವೆ",
    recentDocuments: "ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳು",
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    verificationProgress: "ದೃಢೀಕರಣ ದರ",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    requiresHumanVerification: "ಅಧಿಕಾರಿಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ",
    potentialDuplicateDetected: "ನಕಲಿ ದಾಖಲೆ ಪತ್ತೆಯಾಗಿದೆ",
    activeDisputes: "ಸಕ್ರಿಯ ಭೂ ವಿವಾದಗಳು",
    systemIntegrityStatus: "ಭದ್ರತೆ ಮತ್ತು ಸಮಗ್ರತೆ",
    verifiedIntegrityDesc: "ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಹ್ಯಾಶ್ ಚೈನಿಂಗ್ ಮೂಲಕ ರಕ್ಷಿಸಲಾಗಿದೆ.",

    landSearchTitle: "ಭೂಮಿ ಹುಡುಕಾಟ",
    landSearchSubtitle: "ಸರ್ವೆ ನಂಬರ್ ಮತ್ತು ಪ್ರದೇಶಗಳ ಆಧಾರದ ಮೇಲೆ ಭೂಮಿ ಹುಡುಕಿ",
    cascadingLocationFilter: "ಸ್ಥಳ ಫಿಲ್ಟರ್",
    selectState: "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectDistrict: "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectTaluk: "ತಾಲೂಕನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectVillage: "ಗ್ರಾಮವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    district: "ಜಿಲ್ಲೆ",
    taluk: "ತಾಲೂಕು",
    village: "ಗ್ರಾಮ",
    surveyNumber: "ಸರ್ವೆ ನಂಬರ್",
    pattaNumber: "ಪಟ್ಟಾ ನಂಬರ್",
    khasraNumber: "ಖಸ್ರಾ ನಂಬರ್",
    ownerName: "ಭೂ ಮಾಲೀಕರ ಹೆಸರು",
    searchByParameters: "ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ",
    matchingLandRecords: "ಹೊಂದಿಕೆಯಾಗುವ ಭೂ ದಾಖಲೆಗಳು",
    parcelDetails: "ಭೂಮಿ ವಿವರಗಳು",
    extentArea: "ವಿಸ್ತೀರ್ಣ",
    landClassification: "ವರ್ಗೀಕರಣ",
    subdivision: "ಉಪವಿಭಾಗ ನಂಬರ್",
    viewOnMap: "GIS ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ",
    gisCadastralViewer: "GIS ನಕ್ಷೆ ವೀಕ್ಷಕ",
    mapLayers: "ನಕ್ಷೆಯ ಪದರಗಳು",
    zoomIn: "ಜೂಮ್ ಇನ್",
    zoomOut: "ಜೂಮ್ ಔಟ್",

    documentNumber: "ದಾಖಲೆ ಸಂಖ್ಯೆ",
    documentTitle: "ದಾಖಲೆಯ ಶೀರ್ಷಿಕೆ",
    documentType: "ದಾಖಲೆಯ ಪ್ರಕಾರ",
    fileSize: "ಫೈಲ್ ಗಾತ್ರ",
    version: "ಆವೃತ್ತಿ",
    uploadedOn: "ಅಪ್‌ಲೋಡ್ ದಿನಾಂಕ",
    verifiedOn: "ದೃಢೀಕರಿಸಿದ ದಿನಾಂಕ",
    dragAndDropFiles: "ನಿಮ್ಮ PDF ದಾಖಲೆಯನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ",
    orBrowseFiles: "ಅಥವಾ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
    supportedFormats: "ಬೆಂಬಲಿತ ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು: PDF, JPEG, PNG (ಗರಿಷ್ಠ 25MB)",
    maxFileSize: "ಗರಿಷ್ಠ ಗಾತ್ರ: 25MB",
    uploadNewVersion: "ಹೊಸ ಆವೃತ್ತಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    reasonForUpdate: "ನವೀಕರಣಕ್ಕೆ ಕಾರಣ",
    deleteDocumentTitle: "ದಾಖಲೆ ಅಳಿಸಿ",
    deleteDocumentConfirm: "ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",
    passwordProtectedUnlockInfo: "ಪಾಸ್‌ವರ್ಡ್ ರಕ್ಷಿತ ಪ್ರಮಾಣಪತ್ರ",
    passwordFormulaExplanation: "ಪ್ರಮಾಣಪತ್ರ ಪಾಸ್‌ವರ್ಡ್ ಸೂತ್ರ: ಸರ್ವೆ ನಂಬರ್ + ಮಾಲೀಕರ ಮೊದಲ ಹೆಸರು ದೊಡ್ಡಕ್ಷರಗಳಲ್ಲಿ.",
    testPassword: "ಪಾಸ್‌ವರ್ಡ್ ಪರೀಕ್ಷಿಸಿ",
    unlockFormulaExample: "ಉದಾಹರಣೆ: 142/3A + Ramasamy -> 1423ARAMASAMY",

    cameraScannerTitle: "ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನರ್ ಮತ್ತು OCR",
    cameraScannerSubtitle: "ದಾಖಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಮತ್ತು 17 ವಿವರಗಳನ್ನು ತಕ್ಷಣ ಪಡೆಯಿರಿ",
    startCamera: "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ",
    stopCamera: "ಕ್ಯಾಮೆರಾ ನಿಲ್ಲಿಸಿ",
    capturePage: "ಪುಟ ಸೆರೆಹಿಡಿಯಿರಿ",
    retakePage: "ಮರುಪಡೆಯಿರಿ",
    switchCamera: "ಕ್ಯಾಮೆರಾ ಬದಲಾಯಿಸಿ",
    scannedPages: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಪುಟಗಳು",
    addPage: "ಇನ್ನೊಂದು ಪುಟ ಸೇರಿಸಿ",
    removePage: "ಪುಟ ತೆಗೆದುಹಾಕಿ",
    compileAndRunOCR: "ದಾಖಲೆಯನ್ನು ಕಂಪೈಲ್ ಮಾಡಿ OCR ಚಲಾಯಿಸಿ",
    imageQualityScore: "ಚಿತ್ರದ ಗುಣಮಟ್ಟದ ಸ್ಕೋರ್",
    ocrConfidence: "OCR ನಿಖರತೆ",
    extracted17Fields: "ಪಡೆದ 17 ಭೂ ವಿವರಗಳು",
    fieldLabel: "ವಿವರಗಳ ಹೆಸರು",
    extractedValue: "ಪಡೆದ ಮೌಲ್ಯ",
    confidenceScore: "ನಿಖರತೆ",
    verifiedByOfficer: "ಅಧಿಕಾರಿಯಿಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ",

    verificationQueueTitle: "ಅಧಿಕಾರಿ ದಾಖಲೆ ದೃಢೀಕರಣ ಸರತಿ",
    verificationQueueSubtitle: "ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಡಿಜಿಟಲ್ ನಿರ್ಧಾರ ಸಲ್ಲಿಸಿ",
    splitScreenReview: "ಸ್ಪ್ಲಿಟ್ ಸ್ಕ್ರೀನ್ ಪರಿಶೀಲನೆ",
    originalDeedPreview: "ಮೂಲ ದಾಖಲೆಯ ಮುನ್ನೋಟ",
    extractedScheduleComparison: "ಪಡೆದ ವಿವರಗಳು vs ಸರ್ಕಾರಿ ದಾಖಲೆ",
    officerDecision: "ಅಧಿಕಾರಿಯ ನಿರ್ಧಾರ",
    approveDeed: "ಅನುಮೋದಿಸಿ (ಪ್ರಮಾಣಪತ್ರ ನೀಡಿ)",
    rejectDeed: "ತಿರಸ್ಕರಿಸಿ",
    requestCorrection: "ತಿದ್ದುಪಡಿಗೆ ಕೋರಿ",
    markAsDuplicate: "ನಕಲಿ ಎಂದು ಗುರುತಿಸಿ",
    officerRemarks: "ಅಧಿಕೃತ ಅಭಿಪ್ರಾಯಗಳು",
    correctionInstructions: "ತಿದ್ದುಪಡಿ ಸೂಚನೆಗಳು",
    approvalHistory: "ಅನುಮೋದನೆ ಇತಿಹಾಸ",
    decisionSubmittedSuccess: "ನಿರ್ಧಾರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.",

    aiReviewTitle: "AI ದಾಖಲೆ ಪರಿಶೀಲನೆ",
    aiReviewSubtitle: "ಸ್ವಯಂಚಾಲಿತ ವರ್ಗೀಕರಣ, 17-ವಿವರ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ನಕಲಿ ಪತ್ತೆ",
    overallAIScore: "ಒಟ್ಟಾರೆ AI ಸ್ಕೋರ್",
    qualityGrade: "ಗುಣಮಟ್ಟದ ಗ್ರೇಡ್",
    compulsoryOfficerInspection: "ಕಡ್ಡಾಯ ಅಧಿಕಾರಿ ತಪಾಸಣೆ",
    ruleValidationChecks: "ನಿಯಮ ದೃಢೀಕರಣ ತಪಾಸಣೆ",
    inconsistenciesDetected: "ಲೋಪದೋಷಗಳು ಕಂಡುಬಂದಿವೆ",
    duplicateOverlapRisk: "ನಕಲಿ ಮತ್ತು ಗಡಿ ಅತಿಕ್ರಮಣ ಅಪಾಯ",
    digitalImageForensics: "ಚಿತ್ರ ವಿಧಿವಿಜ್ಞಾನ ಮತ್ತು ತಿರುಚುವಿಕೆ ಅಪಾಯ",
    tamperRiskScore: "ತಿರುಚುವಿಕೆ ಅಪಾಯ ಸ್ಕೋರ್",
    officerRecommendations: "ಅಧಿಕಾರಿಗೆ ಶಿಫಾರಸುಗಳು",
    regenerateAIReview: "AI ವಿಶ್ಲೇಷಣೆಯನ್ನು ಮರುಚಾಲನೆ ಮಾಡಿ",
    aiDisclaimer: "AI ಪರಿಶೀಲನೆಯು ಅಧಿಕಾರಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು ರಚಿಸಲಾಗಿದೆ. ಅಂತಿಮ ನಿರ್ಧಾರ ತಹಶೀಲ್ದಾರ್ ಅವರದ್ದಾಗಿದೆ.",

    duplicateDetectionTitle: "ನಕಲಿ ದಾಖಲೆ ಪತ್ತೆ",
    duplicateDetectionSubtitle: "ಒಂದೇ ಸರ್ವೆ ನಂಬರ್‌ನ ನಕಲಿ ನೋಂದಣಿ ಪ್ರಯತ್ನಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ",
    similarityScore: "ಹೋಲಿಕೆ ಸ್ಕೋರ್",
    matchedFields: "ಹೊಂದಿಕೆಯಾಗುವ ವಿವರಗಳು",
    comparedDocuments: "ವಿವಾದಿತ ದಾಖಲೆಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ",
    investigateDuplicate: "ವಿವಾದವನ್ನು ತನಿಖೆ ಮಾಡಿ",
    confirmFraud: "ವಂಚನೆ ಎಂದು ದೃಢೀಕರಿಸಿ",
    dismissDuplicate: "ಖುಲಾಸೆಗೊಳಿಸಿ (ಕಾನೂನುಬದ್ಧ ವರ್ಗಾವಣೆ)",
    duplicateResolutionRemarks: "ಪರಿಹಾರದ ಅಭಿಪ್ರಾಯಗಳು",

    mockAadhaarTitle: "ಮಾಕ್ ಆಧಾರ್ ದೃಢೀಕರಣ (KYC)",
    mockAadhaarSubtitle: "ಡೆಮೊ ಪ್ರೊಫೈಲ್‌ಗಳು ಮತ್ತು ತ್ವರಿತ OTP ಮೂಲಕ ಗುರುತನ್ನು ದೃಢೀಕರಿಸಿ",
    enter12DigitAadhaar: "12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    requestOTP: "ಡೆಮೊ OTP ವಿನಂತಿಸಿ",
    enter6DigitOTP: "6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
    verifyOTP: "ಗುರುತನ್ನು ದೃಢೀಕರಿಸಿ",
    kycVerifiedSuccess: "ಗುರುತನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    syntheticDemoAccounts: "ಡೆಮೊ ನಾಗರಿಕರ ಪಟ್ಟಿ",
    useDemoProfile: "ಈ ಪ್ರೊಫೈಲ್ ಬಳಸಿ",

    storageVaultTitle: "ನನ್ನ ಸುರಕ್ಷಿತ ವಾಲ್ಟ್ (1GB ಉಚಿತ ಸಂಗ್ರಹ)",
    storageVaultSubtitle: "ಮಿಲಿಟರಿ ದರ್ಜೆಯ AES-256 GCM ಎನ್‌ಕ್ರಿಪ್ಶನ್‌ನೊಂದಿಗೆ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ",
    quotaUsage: "ಸಂಗ್ರಹಣೆ ಬಳಕೆ",
    vaultFolderCategories: "ವಾಲ್ಟ್ ಫೋಲ್ಡರ್‌ಗಳು",
    uploadToVault: "ವಾಲ್ಟ್‌ಗೆ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    folderCategory: "ಫೋಲ್ಡರ್ ವರ್ಗ",
    encryptedWithAES256: "AES-256 GCM ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ",
    downloadDecryptedFile: "ಡೀಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",

    disputesTitle: "ಭೂ ವಿವಾದಗಳು ಮತ್ತು ಗಡಿ ದೂರುಗಳು",
    disputesSubtitle: "ಗಡಿ ಅತಿಕ್ರಮಣ ದೂರುಗಳನ್ನು ದಾಖಲಿಸಿ ಮತ್ತು ವಿಚಾರಣೆ ದಿನಾಂಕಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    fileNewDispute: "ಹೊಸ ದೂರು ದಾಖಲಿಸಿ",
    disputeCategory: "ವಿವಾದದ ವರ್ಗ",
    encroachmentDetails: "ಅತಿಕ್ರಮಣದ ವಿವರಣೆ",
    uploadEvidenceDocuments: "ಪುರಾವೆ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    scheduledHearingDate: "ವಿಚಾರಣೆಯ ದಿನಾಂಕ",
    resolutionSummary: "ಕಂದಾಯ ಅಧಿಕಾರಿ ಪರಿಹಾರದ ಸಾರಾಂಶ",

    auditLogsTitle: "ಆಡಿಟ್ ಲಾಗ್‌ಗಳು ಮತ್ತು ಬ್ಲಾಕ್‌ಚೈನ್ ಹ್ಯಾಶ್ ಚೈನ್",
    auditLogsSubtitle: "ಎಲ್ಲಾ ಅಪ್‌ಲೋಡ್‌ಗಳು ಮತ್ತು ನಿರ್ಧಾರಗಳನ್ನು ದಾಖಲಿಸುವ ಭದ್ರತಾ ಲೆಡ್ಜರ್",
    blockchainIntegrityChain: "ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಆಡಿಟ್ ಚೈನ್",
    blockHash: "SHA-256 ಬ್ಲಾಕ್ ಹ್ಯಾಶ್",
    previousHash: "ಹಿಂದಿನ ಹ್ಯಾಶ್",
    actor: "ಬಳಕೆದಾರ / ಅಧಿಕಾರಿ",
    ipAddress: "IP ವಿಳಾಸ",
    eventAction: "ಈವೆಂಟ್ ಕ್ರಿಯೆ",
    tamperIntegrityVerified: "100% ಹ್ಯಾಶ್ ಸಮಗ್ರತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    fraudReviewTitle: "AI ವಂಚನೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಫೋರೆನ್ಸಿಕ್ಸ್",
    fraudReviewSubtitle: "ಫಾಂಟ್ ದೋಷಗಳು ಮತ್ತು ಮೆಟಾಡೇಟಾ ಬದಲಾವಣೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",

    profileTitle: "ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    profileSubtitle: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್, ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಭಾಷೆಯ ಆಯ್ಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    personalInformation: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
    accountSecurity: "ಭದ್ರತೆ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್",
    changePasswordTitle: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
    currentPassword: "ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್",
    newPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",
    confirmNewPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    preferredLanguage: "ಪೋರ್ಟಲ್ ಭಾಷೆ",

    aiAssistant: "ಡಿಜಿಲ್ಯಾಂಡ್ AI ಸಹಾಯಕ",
    askAssistant: "ಪಟ್ಟಾ, ಸರ್ವೆ ನಂಬರ್ ಅಥವಾ ದೃಢೀಕರಣದ ಬಗ್ಗೆ ಕೇಳಿ...",
    listeningVoice: "ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    speakQuestion: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ",
    stopVoice: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
    voiceSynchronized: "ಧ್ವನಿ ಸಿಂಕ್ರೊನೈಸ್ ಮಾಡಲಾಗಿದೆ • 6 ಭಾಷೆಗಳು"
  },
  ml: {
    brandName: "ഡിജിലാൻഡ്",
    brandTagline: "AI അധിഷ്ഠിത ഡിജിറ്റൽ ഭൂമി രേഖാ മാനേജ്‌മെന്റ് സിസ്റ്റം",
    officialGovtPortal: "ഔദ്യോഗിക ഭൂഭരണ റവന്യൂ പോർട്ടൽ",
    allRightsReserved: "ഭാരത സർക്കാർ. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
    tamperProofBlockchainProtected: "SHA-256 ഓഡിറ്റ് ചെയിൻ വഴി സംരക്ഷിക്കപ്പെട്ടിരിക്കുന്നു",
    languageName: "മലയാളം",

    save: "സംരക്ഷിക്കുക",
    cancel: "റദ്ദാക്കുക",
    submit: "സമർപ്പിക്കുക",
    delete: "നീക്കം ചെയ്യുക",
    edit: "തിരുത്തുക",
    view: "കാണുക",
    download: "ഡൗൺലോഡ്",
    upload: "അപ്‌ലോഡ്",
    search: "തിരയുക",
    filter: "ഫിൽട്ടർ",
    clear: "മായ്ക്കുക",
    reset: "റീസെറ്റ്",
    retry: "വീണ്ടും ശ്രമിക്കുക",
    close: "അടയ്ക്കുക",
    confirm: "സ്ഥിരീകരിക്കുക",
    back: "പിന്നോട്ട്",
    next: "അടുത്തത്",
    open: "തുറക്കുക",
    refresh: "പുതുക്കുക",
    copy: "പകർത്തുക",
    copied: "പകർത്തി!",
    actions: "നടപടികൾ",
    status: "നില",
    date: "തീയതി",
    details: "വിവരങ്ങൾ",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    processing: "പ്രക്രിയയിലാണ്...",
    pleaseWait: "ദയവായി കാത്തിരിക്കൂ...",
    noData: "വിവരങ്ങൾ ലഭ്യമല്ല",
    noResultsFound: "ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
    all: "എല്ലാം",
    yes: "അതെ",
    no: "അല്ല",
    viewDetails: "വിശദാംശങ്ങൾ കാണുക",
    viewReport: "AI റിപ്പോർട്ട് കാണുക",
    downloadCertificate: "സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡ്",
    learnMore: "കൂടുതൽ അറിയുക",

    statusVerified: "സ്ഥിരീകരിച്ചു",
    statusPending: "പരിശോധനയിലാണ്",
    statusRejected: "നിരസിച്ചു",
    statusVerificationRequired: "സ്ഥിരീകരണം ആവശ്യമാണ്",
    statusCorrectionRequested: "തിരുത്തൽ ആവശ്യപ്പെട്ടു",
    statusDuplicateSuspected: "വ്യാജരേഖ സംശയിക്കുന്നു",
    statusUnderReview: "പരിഗണനയിലാണ്",
    statusFlaggedByOfficer: "ഉദ്യോഗസ്ഥൻ അടയാളപ്പെടുത്തി",
    statusDismissed: "തള്ളി",
    statusConfirmedFraud: "തട്ടിപ്പ് സ്ഥിരീകരിച്ചു",
    statusNeedsReview: "പുനഃപരിശോധന ആവശ്യമാണ്",
    statusSubmitted: "സമർപ്പിച്ചു",
    statusResolved: "പരിഹരിച്ചു",
    statusActive: "സജീവം",
    statusCompleted: "പൂർത്തിയായി",
    statusFailed: "പരാജയപ്പെട്ടു",
    statusEscalated: "മേലുദ്യോഗസ്ഥന് കൈമാറി",

    login: "സൈൻ ഇൻ",
    register: "രജിസ്റ്റർ ചെയ്യുക",
    logout: "സൈൻ ഔട്ട്",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    myDocuments: "എന്റെ പ്രമാണങ്ങൾ",
    uploadDocument: "പ്രമാണം അപ്‌ലോഡ് ചെയ്യുക",
    scanDocument: "പ്രമാണം സ്കാൻ ചെയ്യുക",
    updateDocument: "പ്രമാണം പുതുക്കുക",
    downloadDocument: "പ്രമാണം ഡൗൺലോഡ് ചെയ്യുക",
    landSearch: "ഭൂമി തിരയൽ",
    gisMap: "GIS ഭൂപടം",
    verificationStatus: "സ്ഥിരീകരണ നില",
    notifications: "അറിയിപ്പുകൾ",
    profile: "ഉപയോക്തൃ പ്രൊഫൈൽ",
    auditHistory: "ഓഡിറ്റ് ചരിത്രം",
    mySecureStorage: "സുരക്ഷിത സംഭരണ നിലവറ",
    identityVerification: "ആധാർ സ്ഥിരീകരണം",
    disputes: "ഭൂതർക്കങ്ങൾ",
    citizenRecords: "പൗരരേഖകൾ",
    documentVerification: "പ്രമാണ സ്ഥിരീകരണം",
    ocrReview: "OCR പരിശോധന",
    dataValidation: "ഡാറ്റാ സ്ഥിരീകരണം",
    duplicateDetection: "വ്യാജരേഖ കണ്ടെത്തൽ",
    fraudReviewQueue: "തട്ടിപ്പ് പരിശോധനാ നിര",
    officerDisputes: "തർക്ക പരിഹാരം",
    auditLogs: "സിസ്റ്റം ഓഡിറ്റ് ലോഗുകൾ",
    roleCitizen: "പൗര പോർട്ടൽ",
    roleOfficer: "റവന്യൂ ഉദ്യോഗസ്ഥ പോർട്ടൽ",
    roleAdmin: "റവന്യൂ അഡ്മിൻ പോർട്ടൽ",
    viewAll: "എല്ലാം കാണുക",
    markAllRead: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക",
    noNotifications: "പുതിയ അറിയിപ്പുകളൊന്നുമില്ല",

    signInTitle: "ഡിജിലാൻഡിലേക്ക് സൈൻ ഇൻ ചെയ്യുക",
    signInSubtitle: "നിങ്ങളുടെ പരിശോധിച്ചുറപ്പിച്ച ഭൂമി രേഖകളും സേവനങ്ങളും ആക്സസ് ചെയ്യുക",
    registerTitle: "ഡിജിലാൻഡ് അക്കൗണ്ട് നിർമ്മിക്കുക",
    registerSubtitle: "ഭൂവുടമസ്ഥതാ സേവനങ്ങൾക്കായി രജിസ്റ്റർ ചെയ്യുക",
    emailOrPhone: "ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ",
    emailAddress: "ഇമെയിൽ വിലാസം",
    phoneNumber: "മൊബൈൽ നമ്പർ",
    password: "പാസ്‌വേഡ്",
    confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    fullName: "പൂർണ്ണമായ പേര്",
    age: "പ്രായം",
    selectRole: "പോർട്ടൽ പങ്ക് തിരഞ്ഞെടുക്കുക",
    forgotPassword: "പാസ്‌വേഡ് മറന്നോ?",
    forgotPasswordTitle: "പാസ്‌വേഡ് പുനഃക്രമീകരിക്കുക",
    forgotPasswordSubtitle: "റീസെറ്റ് ലിങ്ക് ലഭിക്കാൻ ഇമെയിൽ നൽകുക",
    sendResetLink: "റീസെറ്റ് ലിങ്ക് അയയ്ക്കുക",
    backToSignIn: "സൈൻ ഇന്നിലേക്ക് മടങ്ങുക",
    alreadyHaveAccount: "അക്കൗണ്ട് ഉണ്ടോ? സൈൻ ഇൻ ചെയ്യുക",
    dontHaveAccount: "പുതിയ ഉപയോക്താവാണോ? അക്കൗണ്ട് ഉണ്ടാക്കുക",
    demoCredentials: "ഡെമോ ലോഗിൻ വിവരങ്ങൾ",
    loginAsCitizen: "പൗരനായി ലോഗിൻ ചെയ്യുക",
    loginAsOfficer: "റവന്യൂ ഉദ്യോഗസ്ഥനായി ലോഗിൻ ചെയ്യുക",
    invalidCredentials: "അസാധുവായ വിവരങ്ങൾ അല്ലെങ്കിൽ പാസ്‌വേഡ്.",
    passwordsDoNotMatch: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല.",
    accountCreatedSuccess: "അക്കൗണ്ട് വിജയകരമായി രജിസ്റ്റർ ചെയ്തു!",

    welcomeBack: "സ്വാഗതം",
    portalOverview: "ഭൂഭരണ ഡാഷ്‌ബോർഡ് അവലോകനം",
    totalDocuments: "ആകെ പ്രമാണങ്ങൾ",
    processingDocuments: "പ്രക്രിയയിൽ",
    verifiedRecords: "സ്ഥിരീകരിച്ച രേഖകൾ",
    pendingVerification: "സ്ഥിരീകരണം ബാക്കി",
    issuesDetected: "കണ്ടെത്തിയ പ്രശ്നങ്ങൾ",
    recentDocuments: "സമീപകാല പ്രമാണങ്ങൾ",
    recentActivity: "സമീപകാല പ്രവർത്തനങ്ങൾ",
    verificationProgress: "സ്ഥിരീകരണ നിരക്ക്",
    quickActions: "ദ്രുത പ്രവർത്തനങ്ങൾ",
    requiresHumanVerification: "ഉദ്യോഗസ്ഥ പരിശോധന ആവശ്യമാണ്",
    potentialDuplicateDetected: "വ്യാജരേഖാ സാദ്ധ്യത കണ്ടെത്തി",
    activeDisputes: "സജീവ ഭൂതർക്കങ്ങൾ",
    systemIntegrityStatus: "സുരക്ഷയും സമഗ്രതയും",
    verifiedIntegrityDesc: "എല്ലാ രേഖകളും ക്രിപ്റ്റോഗ്രാഫിക് ചെയിനിംഗ് വഴി സുരക്ഷിതമാണ്.",

    landSearchTitle: "ഭൂമി തിരയൽ",
    landSearchSubtitle: "സർവേ നമ്പറും പ്രദേശവും ഉപയോഗിച്ച് ഭൂമി കണ്ടെത്തുക",
    cascadingLocationFilter: "പ്രദേശ ഫിൽട്ടർ",
    selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    selectDistrict: "ജില്ല തിരഞ്ഞെടുക്കുക",
    selectTaluk: "താലൂക്ക് തിരഞ്ഞെടുക്കുക",
    selectVillage: "വില്ലേജ് തിരഞ്ഞെടുക്കുക",
    district: "ജില്ല",
    taluk: "താലൂക്ക്",
    village: "വില്ലേജ്",
    surveyNumber: "സർവേ നമ്പർ",
    pattaNumber: "പട്ടാ നമ്പർ",
    khasraNumber: "ഖസ്ര നമ്പർ",
    ownerName: "ഭൂവുടമയുടെ പേര്",
    searchByParameters: "രേഖകൾ തിരയുക",
    matchingLandRecords: "പൊരുത്തപ്പെടുന്ന ഭൂമി വിവരങ്ങൾ",
    parcelDetails: "ഭൂമി വിശദാംശങ്ങൾ",
    extentArea: "വിസ്തീർണ്ണം",
    landClassification: "തരംതിരിവ്",
    subdivision: "സബ്ഡിവിഷൻ നമ്പർ",
    viewOnMap: "GIS ഭൂപടത്തിൽ കാണുക",
    gisCadastralViewer: "GIS ഭൂപട വ്യൂവർ",
    mapLayers: "ഭൂപട ലെയറുകൾ",
    zoomIn: "വലുതാക്കുക",
    zoomOut: "ചെറുതാക്കുക",

    documentNumber: "പ്രമാണ നമ്പർ",
    documentTitle: "പ്രമാണ ശീർഷകം",
    documentType: "പ്രമാണ തരം",
    fileSize: "ഫയൽ വലുപ്പം",
    version: "പതിപ്പ്",
    uploadedOn: "അപ്‌ലോഡ് തീയതി",
    verifiedOn: "സ്ഥിരീകരിച്ച തീയതി",
    dragAndDropFiles: "നിങ്ങളുടെ PDF പ്രമാണം ഇവിടെ ഇടുക",
    orBrowseFiles: "അല്ലെങ്കിൽ ഫയൽ തിരഞ്ഞെടുക്കുക",
    supportedFormats: "പിന്തുണയ്ക്കുന്ന ഫോർമാറ്റുകൾ: PDF, JPEG, PNG (പരമാവധി 25MB)",
    maxFileSize: "പരമാവധി വലുപ്പം: 25MB",
    uploadNewVersion: "പുതിയ പതിപ്പ് അപ്‌ലോഡ് ചെയ്യുക",
    reasonForUpdate: "മാറ്റത്തിനുള്ള കാരണം",
    deleteDocumentTitle: "പ്രമാണം ഇല്ലാതാക്കുക",
    deleteDocumentConfirm: "ഈ പ്രമാണം നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?",
    passwordProtectedUnlockInfo: "പാസ്‌വേഡ് സംരക്ഷിത സർട്ടിഫിക്കറ്റ്",
    passwordFormulaExplanation: "സർട്ടിഫിക്കറ്റ് പാസ്‌വേഡ്: സർവേ നമ്പർ + ഉടമയുടെ പേര് വലിയക്ഷരത്തിൽ.",
    testPassword: "പാസ്‌വേഡ് പരിശോധിക്കുക",
    unlockFormulaExample: "ഉദാഹരണം: 142/3A + Ramasamy -> 1423ARAMASAMY",

    cameraScannerTitle: "ക്യാമറ സ്കാനറും OCR-ഉം",
    cameraScannerSubtitle: "പ്രമാണങ്ങൾ സ്കാൻ ചെയ്ത് 17 വിശദാംശങ്ങൾ തത്സമയം വേർതിരിച്ചെടുക്കുക",
    startCamera: "ക്യാമറ ആരംഭിക്കുക",
    stopCamera: "ക്യാമറ നിർത്തുക",
    capturePage: "പേജ് പകർത്തുക",
    retakePage: "വീണ്ടും പകർത്തുക",
    switchCamera: "ക്യാമറ മാറ്റുക",
    scannedPages: "പകർത്തപ്പെട്ട പേജുകൾ",
    addPage: "മറ്റൊരു പേജ് ചേർക്കുക",
    removePage: "പേജ് നീക്കം ചെയ്യുക",
    compileAndRunOCR: "രേഖ സമാഹരിച്ച് OCR പ്രവർത്തിപ്പിക്കുക",
    imageQualityScore: "ചിത്രത്തിന്റെ ഗുണനിലവാരം",
    ocrConfidence: "OCR കൃത്യത",
    extracted17Fields: "വേർതിരിച്ചെടുത്ത 17 ഭൂവിവരങ്ങൾ",
    fieldLabel: "വിവര നാമം",
    extractedValue: "വേർതിരിച്ച മൂല്യം",
    confidenceScore: "കൃത്യത",
    verifiedByOfficer: "ഉദ്യോഗസ്ഥൻ സ്ഥിരീകരിച്ചു",

    verificationQueueTitle: "ഉദ്യോഗസ്ഥ പ്രമാണ സ്ഥിരീകരണ നിര",
    verificationQueueSubtitle: "വിവരങ്ങൾ പരിശോധിക്കുകയും ഡിജിറ്റൽ തീരുമാനം രേഖപ്പെടുത്തുകയും ചെയ്യുക",
    splitScreenReview: "സ്പ്ലിറ്റ് സ്ക്രീൻ പരിശോധന",
    originalDeedPreview: "യഥാർത്ഥ പ്രമാണ പ്രിവ്യൂ",
    extractedScheduleComparison: "വേർതിരിച്ച വിവരങ്ങൾ vs സർക്കാർ രേഖ",
    officerDecision: "ഉദ്യോഗസ്ഥന്റെ തീരുമാനം",
    approveDeed: "അംഗീകരിക്കുക (സർട്ടിഫിക്കറ്റ് നൽകുക)",
    rejectDeed: "നിരസിക്കുക",
    requestCorrection: "തിരുത്തൽ ആവശ്യപ്പെടുക",
    markAsDuplicate: "വ്യാജരേഖയായി അടയാളപ്പെടുത്തുക",
    officerRemarks: "ഔദ്യോഗിക അഭിപ്രായങ്ങൾ",
    correctionInstructions: "തിരുത്തൽ നിർദ്ദേശങ്ങൾ",
    approvalHistory: "അംഗീകാര ചരിത്രം",
    decisionSubmittedSuccess: "സ്ഥിരീകരണ തീരുമാനം വിജയകരമായി രേഖപ്പെടുത്തി.",

    aiReviewTitle: "AI പ്രമാണ പുനരവലോകനം",
    aiReviewSubtitle: "ഓട്ടോമേറ്റഡ് വർഗ്ഗീകരണം, 17-ഫീൽഡ് വിശകലനം, വ്യാജരേഖ കണ്ടെത്തൽ",
    overallAIScore: "മൊത്തം AI സ്കോർ",
    qualityGrade: "ഗുണനിലവാര ഗ്രേഡ്",
    compulsoryOfficerInspection: "നിർബന്ധിത ഉദ്യോഗസ്ഥ പരിശോധന",
    ruleValidationChecks: "നിയമ സാധുതാ പരിശോധനകൾ",
    inconsistenciesDetected: "കണ്ടെത്തിയ പൊരുത്തക്കേടുകൾ",
    duplicateOverlapRisk: "വ്യാജരേഖാ അതിർത്തി ഓവർലാപ്പ് സാധ്യത",
    digitalImageForensics: "ഇമേജ് ഫോറൻസിക്സും കൃത്രിമത്വ സാധ്യതയും",
    tamperRiskScore: "കൃത്രിമത്വ സാധ്യത സ്കോർ",
    officerRecommendations: "ഉദ്യോഗസ്ഥർക്കുള്ള ശുപാർശകൾ",
    regenerateAIReview: "AI വിശകലനം വീണ്ടും പ്രവർത്തിപ്പിക്കുക",
    aiDisclaimer: "AI റിപ്പോർട്ട് ഉദ്യോഗസ്ഥരെ സഹായിക്കാനായി തയ്യാറാക്കിയതാണ്. അന്തിമ അധികാരം തഹസിൽദാർക്കാണ്.",

    duplicateDetectionTitle: "വ്യാജരേഖയും അതിർത്തി ഓവർലാപ്പും കണ്ടെത്തൽ",
    duplicateDetectionSubtitle: "ഒരേ സർവേ നമ്പറിലെ ഇരട്ട രജിസ്ട്രേഷൻ ശ്രമങ്ങൾ കണ്ടെത്തുക",
    similarityScore: "സമാനതാ സ്കോർ",
    matchedFields: "പൊരുത്തപ്പെട്ട വിവരങ്ങൾ",
    comparedDocuments: "തർക്ക രേഖകൾ താരതമ്യം ചെയ്യുക",
    investigateDuplicate: "തർക്കം അന്വേഷിക്കുക",
    confirmFraud: "തട്ടിപ്പായി സ്ഥിരീകരിക്കുക",
    dismissDuplicate: "തള്ളുക (നിയമപരമായ കൈമാറ്റം)",
    duplicateResolutionRemarks: "പരിഹാര അഭിപ്രായങ്ങൾ",

    mockAadhaarTitle: "മോക്ക് ആധാർ പരിശോധന (KYC)",
    mockAadhaarSubtitle: "ഡെമോ പ്രൊഫൈലുകളും ഒടിപിയും ഉപയോഗിച്ച് തിരിച്ചറിയൽ പരിശോധിക്കുക",
    enter12DigitAadhaar: "12 അക്ക ആധാർ നമ്പർ നൽകുക",
    requestOTP: "ഡെമോ ഒടിപി ആവശ്യപ്പെടുക",
    enter6DigitOTP: "6 അക്ക ഒടിപി നൽകുക",
    verifyOTP: "തിരിച്ചറിയൽ സ്ഥിരീകരിക്കുക",
    kycVerifiedSuccess: "തിരിച്ചറിയൽ വിജയകരമായി സ്ഥിരീകരിച്ചു",
    syntheticDemoAccounts: "ഡെമോ പൗരന്മാരുടെ പട്ടിക",
    useDemoProfile: "ഈ പ്രൊഫൈൽ ഉപയോഗിക്കുക",

    storageVaultTitle: "എന്റെ സുരക്ഷിത നിലവറ (1GB സൗജന്യ സ്ഥലം)",
    storageVaultSubtitle: "AES-256 GCM എൻക്രിപ്ഷനോടെ പട്ടയങ്ങളും രസീതുകളും സുരക്ഷിതമായി സൂക്ഷിക്കുക",
    quotaUsage: "സംഭരണ ഉപയോഗം",
    vaultFolderCategories: "ഫോൾഡറുകൾ",
    uploadToVault: "നിലവറയിലേക്ക് ഫയൽ അപ്‌ലോഡ് ചെയ്യുക",
    folderCategory: "ഫോൾഡർ വിഭാഗം",
    encryptedWithAES256: "AES-256 GCM എൻക്രിപ്റ്റ് ചെയ്തത്",
    downloadDecryptedFile: "ഡീക്രിപ്റ്റ് ചെയ്ത ഫയൽ ഡൗൺലോഡ് ചെയ്യുക",

    disputesTitle: "ഭൂതർക്കങ്ങളും അതിർത്തി പരാതികളും",
    disputesSubtitle: "അതിർത്തി കൈയേറ്റ പരാതികൾ നൽകുകയും വാദ തീയതികൾ നിരീക്ഷിക്കുകയും ചെയ്യുക",
    fileNewDispute: "പുതിയ പരാതി നൽകുക",
    disputeCategory: "തർക്ക വിഭാഗം",
    encroachmentDetails: "കൈയേറ്റ വിവരങ്ങൾ",
    uploadEvidenceDocuments: "തെളിവ് പ്രമാണങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക",
    scheduledHearingDate: "വിചാരണ തീയതി",
    resolutionSummary: "റവന്യൂ ഉദ്യോഗസ്ഥന്റെ പരിഹാര സംഗ്രഹം",

    auditLogsTitle: "സിസ്റ്റം ഓഡിറ്റ് ലോഗുകളും ബ്ലോക്ക്ചെയിൻ ചെയിനും",
    auditLogsSubtitle: "എല്ലാ പ്രവർത്തനങ്ങളും രേഖപ്പെടുത്തുന്ന സുരക്ഷിത ലെഡ്ജർ",
    blockchainIntegrityChain: "ക്രിപ്റ്റോഗ്രാഫിക് ഓഡിറ്റ് ചെയിൻ",
    blockHash: "SHA-256 ബ്ലോക്ക് ഹാഷ്",
    previousHash: "മുമ്പത്തെ ഹാഷ്",
    actor: "ഉപയോക്താവ് / ഉദ്യോഗസ്ഥൻ",
    ipAddress: "IP വിലാസം",
    eventAction: "പ്രവർത്തനം",
    tamperIntegrityVerified: "100% ഹാഷ് സമഗ്രത സ്ഥിരീകരിച്ചു",
    fraudReviewTitle: "AI തട്ടിപ്പും ഡിജിറ്റൽ ഫോറൻസിക്സും",
    fraudReviewSubtitle: "ഫോണ്ട് മാറ്റങ്ങളും മെറ്റാഡാറ്റയിലെ കൃത്രിമത്വങ്ങളും പരിശോധിക്കുക",

    profileTitle: "ഉപയോക്തൃ പ്രൊഫൈലും ക്രമീകരണങ്ങളും",
    profileSubtitle: "നിങ്ങളുടെ പ്രൊഫൈൽ, പാസ്‌വേഡ്, ഭാഷാ മുൻഗണനകൾ എന്നിവ കൈകാര്യം ചെയ്യുക",
    personalInformation: "വ്യക്തിഗത വിവരങ്ങൾ",
    accountSecurity: "സുരക്ഷയും പാസ്‌വേഡും",
    changePasswordTitle: "പാസ്‌വേഡ് മാറ്റുക",
    currentPassword: "നിലവിലെ പാസ്‌വേഡ്",
    newPassword: "പുതിയ പാസ്‌വേഡ്",
    confirmNewPassword: "പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    preferredLanguage: "പോർട്ടൽ ഭാഷ",

    aiAssistant: "ഡിജിലാൻഡ് AI അസിസ്റ്റന്റ്",
    askAssistant: "പട്ടാ, സർവേ നമ്പർ അല്ലെങ്കിൽ സ്ഥിരീകരണത്തെക്കുറിച്ച് ചോദിക്കൂ...",
    listeningVoice: "ശബ്ദം ശ്രദ്ധിക്കുന്നു...",
    speakQuestion: "നിങ്ങളുടെ ചോദ്യം വ്യക്തമായി സംസാരിക്കുക",
    stopVoice: "ശബ്ദം നിർത്തുക",
    voiceSynchronized: "ശബ്ദം സമന്വയിപ്പിച്ചു • 6 ഭാഷകൾ"
  }
};
