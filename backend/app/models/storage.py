import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, BigInteger, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserStorageQuota(Base):
    """
    Citizen storage quota and usage tracking.
    """
    __tablename__ = "user_storage_quotas"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    quota_bytes = Column(BigInteger, default=1024 * 1024 * 1024) # 1 GB
    used_bytes = Column(BigInteger, default=0)
    file_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="storage_quota")


class StorageFile(Base):
    """
    Individual files stored in citizen's 'My Secure Storage' personal vault.
    """
    __tablename__ = "storage_files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    folder_category = Column(String(100), default="Land Documents") # Land Documents, Identity Documents, Tax Documents, Receipts, Certificates, Other
    file_name = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_path = Column(String(500), nullable=False)
    is_encrypted = Column(Boolean, default=True)
    encryption_key_id = Column(String(50), default="AES256-GCM-V1")
    description = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="storage_files")
    encryption_metadata = relationship("DocumentEncryptionMetadata", back_populates="storage_file", uselist=False, cascade="all, delete-orphan")


class DocumentEncryptionMetadata(Base):
    """
    Metadata for AES-256-GCM file-level authenticated disk encryption.
    """
    __tablename__ = "document_encryption_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=True, index=True)
    storage_file_id = Column(Integer, ForeignKey("storage_files.id", ondelete="CASCADE"), nullable=True, index=True)
    encryption_algo = Column(String(50), default="AES-256-GCM")
    nonce_base64 = Column(String(100), nullable=False)
    key_id = Column(String(50), default="DEFAULT_PRIMARY")
    original_size = Column(BigInteger, nullable=False)
    file_size_encrypted = Column(BigInteger, nullable=False)
    encrypted_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("Document", back_populates="encryption_metadata")
    storage_file = relationship("StorageFile", back_populates="encryption_metadata")
