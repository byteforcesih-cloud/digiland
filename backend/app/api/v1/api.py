from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    documents,
    verification,
    validation,
    duplicate,
    gis,
    analytics,
    audit,
    notifications,
    chatbot,
    identity,
    scanner,
    storage,
    locations,
    captcha,
    fraud,
    integrity,
    qr_verify,
    approval,
    disputes,
    security_ops,
    ai_review
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(identity.router, prefix="/identity", tags=["Mock Aadhaar Identity Verification"])
api_router.include_router(documents.router, prefix="/documents", tags=["Document Management"])
api_router.include_router(ai_review.router, prefix="/ai-review", tags=["AI Document Review"])
api_router.include_router(scanner.router, prefix="/scanner", tags=["Multi-Page Camera Scanner & Quality Analysis"])
api_router.include_router(storage.router, prefix="/storage", tags=["My Secure Storage Personal Vault"])
api_router.include_router(locations.router, prefix="/locations", tags=["Location Hierarchy & Autocomplete"])
api_router.include_router(captcha.router, prefix="/captcha", tags=["Risk-Based CAPTCHA"])
api_router.include_router(fraud.router, prefix="/fraud", tags=["AI Document Fraud & Tampering Detection"])
api_router.include_router(integrity.router, prefix="/integrity", tags=["Blockchain-Inspired Tamper Audit Chain"])
api_router.include_router(qr_verify.router, prefix="/qr", tags=["QR Certificate Verification"])
api_router.include_router(approval.router, prefix="/approval", tags=["Multi-Level Officer Approvals"])
api_router.include_router(disputes.router, prefix="/disputes", tags=["Land Dispute & Complaint Management"])
api_router.include_router(security_ops.router, prefix="/security", tags=["Security Monitoring & Feature Access"])
api_router.include_router(verification.router, prefix="/verification", tags=["Officer Verification"])
api_router.include_router(validation.router, prefix="/validation", tags=["Data Validation"])
api_router.include_router(duplicate.router, prefix="/duplicate", tags=["Duplicate Detection"])
api_router.include_router(gis.router, prefix="/gis", tags=["GIS & Land Search"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Dashboard Analytics"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit Logs"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["AI Land Assistant"])
