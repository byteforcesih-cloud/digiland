import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.aadhaar import MockAadhaarProfile, IdentityVerification
from app.models.document import Document, DocumentVersion, ExtractedField, OCRResult
from app.models.land import LandRecord, GISData
from app.models.storage import StorageFile, DocumentEncryptionMetadata

def inspect_aadhaar_database():
    db = SessionLocal()
    try:
        profiles = db.query(MockAadhaarProfile).order_by(MockAadhaarProfile.id.asc()).all()
        print("\n" + "=" * 90)
        print(f"[MOCK AADHAAR CARD DATABASE] - Total Records: {len(profiles)}")
        print("=" * 90)
        print(f"{'ID':<4} | {'Full Name':<24} | {'Masked Aadhaar':<16} | {'Gender':<6} | {'DOB':<12} | {'State':<16} | {'District'}")
        print("-" * 90)
        for p in profiles[:15]:
            print(f"{p.id:<4} | {p.full_name:<24} | {p.aadhaar_number:<16} | {p.gender:<6} | {str(p.date_of_birth):<12} | {p.state:<16} | {p.district}")
        if len(profiles) > 15:
            print(f"... and {len(profiles) - 15} more synthetic profiles in the database.")
            
        print("\n" + "-" * 90)
        print("[Identity Verification Linkages] (User -> Mock Aadhaar):")
        verifications = db.query(IdentityVerification).all()
        if not verifications:
            print("  (No active verification sessions completed yet. Test via /citizen/identity-verification)")
        else:
            for v in verifications:
                print(f"  User ID: {v.user_id} | Aadhaar: {v.aadhaar_number} | Status: {v.status} | Verified At: {v.verified_at}")
    finally:
        db.close()

def inspect_documents_database():
    db = SessionLocal()
    try:
        docs = db.query(Document).order_by(Document.id.desc()).all()
        print("\n" + "=" * 100)
        print(f"[DOCUMENTS & PDF DATABASE] - Total Documents: {len(docs)}")
        print("=" * 100)
        print(f"{'ID':<4} | {'Doc Number':<20} | {'Document Type':<18} | {'Status':<22} | {'Encrypted':<10} | {'Title'}")
        print("-" * 100)
        for d in docs[:12]:
            enc_str = "AES-256" if d.is_encrypted else "Plain"
            print(f"{d.id:<4} | {d.document_number:<20} | {d.document_type:<18} | {d.status:<22} | {enc_str:<10} | {d.title[:30]}")
        if len(docs) > 12:
            print(f"... and {len(docs) - 12} more land documents registered.")

        # Show sample document with OCR fields and encryption metadata
        if docs:
            sample = docs[0]
            print("\n" + "-" * 100)
            print(f"[Detailed Inspection for Document #{sample.id} ({sample.document_number})]:")
            print(f"  * File Path on Disk: {sample.file_path}")
            print(f"  * File Size: {sample.file_size} bytes")
            print(f"  * Current Version: v{sample.current_version}")
            
            # Encryption info
            if sample.encryption_metadata:
                em = sample.encryption_metadata
                print(f"  * AES-256 Key ID: {em.key_id} | Nonce: {em.nonce_base64[:16]}... | Encrypted Size: {em.file_size_encrypted} bytes")
            
            # Extracted Fields
            fields = db.query(ExtractedField).filter(ExtractedField.document_id == sample.id).all()
            print(f"  * Extracted OCR Fields ({len(fields)} fields):")
            for f in fields[:6]:
                conf = f"{f.confidence_score:.1f}%" if f.confidence_score else "N/A"
                print(f"      - {f.field_label}: '{f.field_value}' (Confidence: {conf})")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_aadhaar_database()
    inspect_documents_database()
