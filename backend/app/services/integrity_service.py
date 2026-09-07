import hashlib
import hmac
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.document import Document, DocumentVersion
from app.models.integrity_qr import IntegrityAuditChain

GENESIS_BLOCK_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
INTEGRITY_SECRET_KEY = b"DIGILAND_BLOCKCHAIN_AUDIT_SECRET_2026"

class IntegrityService:
    """
    Manages cryptographic SHA-256 block hashing and audit chains for document versions.
    Provides tamper verification and tamper-evident history records.
    """

    @staticmethod
    def compute_sha256_bytes(content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()

    @staticmethod
    def generate_block_hash(
        block_index: int,
        previous_hash: str,
        current_doc_hash: str,
        action: str,
        timestamp_str: str
    ) -> str:
        """
        Creates a chained block hash combining index, previous hash, payload hash, and action.
        """
        block_payload = f"{block_index}:{previous_hash}:{current_doc_hash}:{action}:{timestamp_str}".encode("utf-8")
        return hashlib.sha256(block_payload).hexdigest()

    @classmethod
    def record_document_block(
        cls,
        db: Session,
        document_id: int,
        version_number: int,
        file_hash: str,
        action: str = "DOCUMENT_DIGITIZED",
        user_id: Optional[int] = None,
        user_role: str = "CITIZEN"
    ) -> IntegrityAuditChain:
        """
        Appends an immutable block to the document's audit chain.
        """
        # Find latest block for this document
        last_block = (
            db.query(IntegrityAuditChain)
            .filter(IntegrityAuditChain.document_id == document_id)
            .order_by(IntegrityAuditChain.block_index.desc())
            .first()
        )

        block_index = (last_block.block_index + 1) if last_block else 0
        prev_hash = last_block.current_hash if last_block else GENESIS_BLOCK_HASH
        
        now = datetime.now(timezone.utc)
        now_str = now.isoformat()
        
        chained_hash = cls.generate_block_hash(block_index, prev_hash, file_hash, action, now_str)
        
        # Cryptographic HMAC signature
        sig = hmac.new(INTEGRITY_SECRET_KEY, chained_hash.encode(), hashlib.sha256).hexdigest()

        block = IntegrityAuditChain(
            document_id=document_id,
            version_number=version_number,
            block_index=block_index,
            current_hash=chained_hash,
            previous_hash=prev_hash,
            action=action,
            user_id=user_id,
            user_role=user_role,
            is_valid=True,
            integrity_status="Integrity Verified",
            signature=sig,
            timestamp=now
        )
        db.add(block)
        db.commit()
        db.refresh(block)
        return block

    @classmethod
    def verify_document_integrity(cls, db: Session, document_id: int) -> Dict[str, Any]:
        """
        Validates the entire cryptographic chain for a document to detect any broken links or mismatches.
        """
        blocks = (
            db.query(IntegrityAuditChain)
            .filter(IntegrityAuditChain.document_id == document_id)
            .order_by(IntegrityAuditChain.block_index.asc())
            .all()
        )

        if not blocks:
            return {
                "document_id": document_id,
                "is_intact": True,
                "integrity_status": "Integrity Verified",
                "total_blocks": 0,
                "chain": [],
                "message": "Genesis state: No modification events recorded."
            }

        is_intact = True
        broken_block_index = None

        for idx, block in enumerate(blocks):
            if idx == 0:
                if block.previous_hash != GENESIS_BLOCK_HASH:
                    is_intact = False
                    broken_block_index = 0
                    break
            else:
                prev_block = blocks[idx - 1]
                if block.previous_hash != prev_block.current_hash:
                    is_intact = False
                    broken_block_index = block.block_index
                    break

        status_str = "Integrity Verified" if is_intact else "Integrity Mismatch"

        return {
            "document_id": document_id,
            "is_intact": is_intact,
            "integrity_status": status_str,
            "broken_block_index": broken_block_index,
            "total_blocks": len(blocks),
            "latest_block_hash": blocks[-1].current_hash if blocks else None,
            "chain_terminology": "Blockchain-Inspired Tamper-Evident Audit Trail",
            "blocks": [
                {
                    "block_index": b.block_index,
                    "version_number": b.version_number,
                    "action": b.action,
                    "current_hash": b.current_hash,
                    "previous_hash": b.previous_hash,
                    "user_role": b.user_role,
                    "timestamp": b.timestamp.isoformat() if b.timestamp else None,
                    "status": b.integrity_status
                }
                for b in blocks
            ]
        }

integrity_service = IntegrityService()
