from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class IntegrityAuditChain(Base):
    """
    Blockchain-inspired tamper-evident immutable audit chain for document versions.
    Links current SHA-256 hash with previous version block hash to detect unauthorized alterations.
    """
    __tablename__ = "integrity_audit_chain"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    block_index = Column(Integer, nullable=False)
    current_hash = Column(String(128), nullable=False) # SHA-256 of the document file
    previous_hash = Column(String(128), nullable=False) # SHA-256 of the predecessor block or GENESIS_BLOCK_HASH
    merkle_root = Column(String(128), nullable=True)
    action = Column(String(100), default="DOCUMENT_DIGITIZED") # DOCUMENT_DIGITIZED, VERSION_UPDATED, OFFICER_APPROVED, DETAILS_CONFIRMED
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_role = Column(String(50), default="CITIZEN")
    is_valid = Column(Boolean, default=True)
    integrity_status = Column(String(50), default="Integrity Verified") # Integrity Verified, Integrity Mismatch, Requires Investigation
    signature = Column(String(255), nullable=True) # Cryptographic HMAC signature
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    document = relationship("Document", back_populates="integrity_chain")


class QRVerificationToken(Base):
    """
    Secure token for QR-code based external certificate and deed verification.
    Does not expose sensitive database IDs or citizen PII publicly.
    """
    __tablename__ = "qr_verification_tokens"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    verification_token = Column(String(64), unique=True, nullable=False, index=True) # Cryptographically random URL-safe token
    qr_code_data_uri = Column(Text, nullable=True) # Base64 SVG/PNG of generated QR
    verification_url = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    is_revoked = Column(Boolean, default=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    scanned_count = Column(Integer, default=0)
    last_scanned_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="qr_tokens")
