import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DigiLand – AI-Powered Digital Land Record Management System"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "digiland-secure-super-jwt-secret-key-2026-chennai-gov-auth-x99")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database URL: defaults to PostgreSQL, falls back to SQLite file if Postgres not active
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/digiland_db"
    )
    SQLITE_FALLBACK_URL: str = "sqlite:///./digiland.db"
    ALLOW_DEMO_DATA_RESET: bool = os.getenv("ALLOW_DEMO_DATA_RESET", "true").lower() == "true"
    
    # AES-256 GCM Key (32 bytes base64 encoded for sensitive field & file encryption)
    AES_ENCRYPTION_KEY: str = os.getenv(
        "AES_ENCRYPTION_KEY", 
        "K8yR2uU4b5qV1w5JzR3LXe2uD7Y5zEwV8N4A9c9tD5u=" # 32-byte valid key
    )
    
    # Storage Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
    DOCUMENTS_DIR: str = os.path.join(BASE_DIR, "uploads", "documents")
    SECURE_STORAGE_DIR: str = os.path.join(BASE_DIR, "uploads", "secure_storage")
    SCANS_DIR: str = os.path.join(BASE_DIR, "uploads", "scans")
    THUMBNAILS_DIR: str = os.path.join(BASE_DIR, "uploads", "thumbnails")
    
    # Storage Quota
    DEFAULT_STORAGE_QUOTA_MB: int = 1024 # 1 GB
    MAX_FILE_UPLOAD_BYTES: int = 25 * 1024 * 1024 # 25 MB
    
    # SMTP / Email Configuration
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "notifications@digiland.gov.in")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "notifications@digiland.gov.in")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    SMTP_MOCK_FALLBACK: bool = True # Automatically falls back to mock delivery if credentials missing
    
    # Allowed CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
    ]
    
    # OCR Settings
    OCR_CONFIDENCE_THRESHOLD: float = 75.0 # Fields with < 75% score flag "Requires Human Verification"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

# Ensure required upload directories exist
os.makedirs(settings.DOCUMENTS_DIR, exist_ok=True)
os.makedirs(settings.SECURE_STORAGE_DIR, exist_ok=True)
os.makedirs(settings.SCANS_DIR, exist_ok=True)
os.makedirs(settings.THUMBNAILS_DIR, exist_ok=True)
