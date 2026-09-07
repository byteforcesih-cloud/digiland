import hashlib
import base64
import os
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union
from jose import jwt
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against bcrypt hashed password."""
    try:
        password_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception:
        # Fallback for direct comparison if ever unhashed in dev
        return plain_password == hashed_password

def get_password_hash(password: str) -> str:
    """Hash password using direct standard bcrypt with salt."""
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

# JWT Token creation & verification
def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    """Generate signed JWT access token with role claim."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None

# Aadhaar and Sensitive Data Encryption (AES-256 GCM Architecture)
def hash_aadhaar(aadhaar_number: str) -> str:
    """Creates deterministic SHA-256 hash of cleaned 12-digit Aadhaar for duplicate detection."""
    cleaned = "".join(filter(str.isdigit, aadhaar_number))
    return hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

deterministic_aadhaar_hash = hash_aadhaar

def mask_aadhaar(aadhaar_number: str) -> str:
    """Masks Aadhaar number showing only the last 4 digits (e.g., 'XXXX-XXXX-4819')."""
    cleaned = "".join(filter(str.isdigit, aadhaar_number))
    if len(cleaned) == 12:
        return f"XXXX-XXXX-{cleaned[-4:]}"
    elif len(cleaned) >= 4:
        return f"XXXX-XXXX-{cleaned[-4:]}"
    return "XXXX-XXXX-XXXX"

# Symmetric AES-256-GCM field encryption/decryption
def _get_aes_key() -> bytes:
    # 32-byte key derived from settings
    key_bytes = hashlib.sha256(settings.AES_ENCRYPTION_KEY.encode("utf-8")).digest()
    return key_bytes

def encrypt_sensitive_data(plaintext: str) -> str:
    """Encrypts plaintext string using AES-256-GCM and returns base64 string with nonce."""
    if not plaintext:
        return ""
    aesgcm = AESGCM(_get_aes_key())
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), None)
    payload = nonce + ciphertext
    return base64.b64encode(payload).decode("utf-8")

def decrypt_sensitive_data(encrypted_b64: str) -> str:
    """Decrypts base64 encoded AES-256-GCM payload."""
    if not encrypted_b64:
        return ""
    try:
        raw = base64.b64decode(encrypted_b64.encode("utf-8"))
        nonce = raw[:12]
        ciphertext = raw[12:]
        aesgcm = AESGCM(_get_aes_key())
        decrypted = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted.decode("utf-8")
    except Exception:
        return encrypted_b64
