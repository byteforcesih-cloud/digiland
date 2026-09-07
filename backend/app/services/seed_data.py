import os
import json
import random
import datetime
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, deterministic_aadhaar_hash, mask_aadhaar
from app.models.user import User, GovernmentOfficer, Role, Permission
from app.models.document import Document, DocumentVersion, ExtractedField, OCRResult
from app.models.document_details import DocumentExtractedDetails
from app.models.land import LandRecord, GISData
from app.models.verification import ValidationResult, VerificationRecord, DuplicateRecord
from app.models.notification import Notification
from app.models.audit import AuditLog
from app.models.aadhaar import MockAadhaarProfile, IdentityVerification, OTPRequest
from app.models.storage import UserStorageQuota, StorageFile, DocumentEncryptionMetadata
from app.models.captcha import CaptchaAttempt
from app.models.email_log import EmailDeliveryLog
from app.models.security_monitoring import SecurityEvent, LoginHistory, DeviceSession, SuspiciousActivity
from app.models.fraud_risk import FraudAnalysisResult, DocumentRiskScore
from app.models.integrity_qr import IntegrityAuditChain, QRVerificationToken
from app.models.approval_workflow import ApprovalWorkflow, ApprovalHistory
from app.models.dispute import DisputeCase, DisputeEvidence, DisputeTimeline
from app.models.feature_access import FeatureAccessDefinition
from app.services.gis_service import GISService
from app.services.integrity_service import integrity_service
from app.services.qr_verification_service import qr_verification_service
from app.services.fraud_detection_service import fraud_detection_service
from app.services.multi_level_approval_service import multi_level_approval_service
from app.services.document_details_service import document_details_service
from app.services.mock_aadhaar_service import DEMO_SYNTHETIC_AADHAAR_PROFILES

# ==============================================================================
# 1. SYNTHETIC CITIZEN PERSONAS & AADHAAR PROFILES (65 DATASETS)
# ==============================================================================
SYNTHETIC_CITIZENS = [
    {"name": "Kathir", "father": "Dharmalingam", "gender": "Male", "dob": "1995-05-10", "state": "Tamil Nadu", "district": "Chennai", "taluk": "Mylapore", "village": "T. Nagar", "pin": "600017", "door": "No. 15", "street": "Gandhi Street", "area": "T. Nagar", "phone": "7894561230", "email": "kathir@gmail.com", "aadhaar": "1234-5678-9012", "password": "987456"},
    {"name": "Tamilarasan D", "father": "Dhanasekaran", "gender": "Male", "dob": "2000-03-24", "state": "Tamil Nadu", "district": "Chennai", "taluk": "Guindy", "village": "Guindy", "pin": "600032", "door": "No. 24", "street": "Anna Salai", "area": "Guindy", "phone": "6382111385", "email": "tamilarasan.d@digiland.demo", "aadhaar": "2428-0522-6816"},
    {"name": "Ramasamy Subramanian", "father": "Subramanian Ramasamy", "gender": "Male", "dob": "1988-05-14", "state": "Tamil Nadu", "district": "Chennai", "taluk": "Mylapore", "village": "Mylapore", "pin": "600004", "door": "No. 42/B", "street": "Luz Church Road", "area": "Mylapore", "phone": "9840123456", "email": "citizen@digiland.gov.in", "aadhaar": "9901-2345-6789"},
    {"name": "Meenakshi Sundaresan", "father": "Sundaresan Natarajan", "gender": "Female", "dob": "1992-08-22", "state": "Tamil Nadu", "district": "Madurai", "taluk": "Madurai South", "village": "Villapuram", "pin": "625012", "door": "Plot 18", "street": "Meenakshi Nagar 2nd Street", "area": "Villapuram", "phone": "9841234567", "email": "meenakshi.s@digiland.demo", "aadhaar": "9902-3456-7890"},
    {"name": "Karthikeyan Annamalai", "father": "Annamalai Palanisamy", "gender": "Male", "dob": "1985-11-30", "state": "Tamil Nadu", "district": "Coimbatore", "taluk": "Coimbatore North", "village": "Saravanampatti", "pin": "641035", "door": "Flat 302, Green Meadows", "street": "Sathy Main Road", "area": "Saravanampatti", "phone": "9842345678", "email": "karthik.a@digiland.demo", "aadhaar": "9903-4567-8901"},
    {"name": "Lakshmi Narayanan", "father": "Narayanan Srinivasan", "gender": "Female", "dob": "1979-03-17", "state": "Tamil Nadu", "district": "Salem", "taluk": "Salem West", "village": "Hasthampatti", "pin": "636007", "door": "No. 115", "street": "Cherry Road", "area": "Hasthampatti", "phone": "9843456789", "email": "lakshmi.n@digiland.demo", "aadhaar": "9904-5678-9012"},
    {"name": "Venkatesh Raghavan", "father": "Raghavan Parthasarathy", "gender": "Male", "dob": "1995-09-05", "state": "Tamil Nadu", "district": "Tiruchirappalli", "taluk": "Srirangam", "village": "Cantonment", "pin": "620001", "door": "No. 8-A", "street": "Collectorate Road", "area": "Cantonment", "phone": "9844567890", "email": "venkatesh.r@digiland.demo", "aadhaar": "9905-6789-0123"},
    {"name": "Ananya Sharma", "father": "Harish Sharma", "gender": "Female", "dob": "1990-12-10", "state": "Karnataka", "district": "Bengaluru Urban", "taluk": "Bengaluru South", "village": "Koramangala", "pin": "560034", "door": "House 514", "street": "80 Feet Main Road 4th Block", "area": "Koramangala", "phone": "9845678901", "email": "ananya.rao@digiland.demo", "aadhaar": "9906-7890-1234"},
    {"name": "Suresh Reddy", "father": "Chandra Shekar Reddy", "gender": "Male", "dob": "1983-07-19", "state": "Telangana", "district": "Hyderabad", "taluk": "Serilingampally", "village": "Gachibowli", "pin": "500032", "door": "Plot 88", "street": "Financial District Road", "area": "Gachibowli", "phone": "9846789012", "email": "suresh.reddy@digiland.demo", "aadhaar": "9907-8901-2345"},
    {"name": "Priya Rajesh Nair", "father": "Rajesh Balakrishnan", "gender": "Female", "dob": "1994-04-28", "state": "Kerala", "district": "Ernakulam", "taluk": "Kanayannur", "village": "Kakkanad", "pin": "682030", "door": "Villa 12", "street": "Infopark Expressway", "area": "Kakkanad", "phone": "9847890123", "email": "priya.nair@digiland.demo", "aadhaar": "9908-9012-3456"},
    {"name": "Rohit Arvind Deshmukh", "father": "Arvind Govind Deshmukh", "gender": "Male", "dob": "1987-01-15", "state": "Maharashtra", "district": "Pune", "taluk": "Haveli", "village": "Aundh", "pin": "411007", "door": "Bungalow 7", "street": "DP Road", "area": "Aundh", "phone": "9848901234", "email": "rohit.deshmukh@digiland.demo", "aadhaar": "9909-0123-4567"},
    {"name": "Aditi Verma", "father": "Ramesh Verma", "gender": "Female", "dob": "1996-06-08", "state": "Uttar Pradesh", "district": "Lucknow", "taluk": "Lucknow", "village": "Gomti Nagar", "pin": "226010", "door": "Flat 402", "street": "Vibhuti Khand", "area": "Gomti Nagar", "phone": "9849012345", "email": "aditi.v@digiland.demo", "aadhaar": "9910-1234-5678"},
    {"name": "Deepak Balaji", "father": "Balaji Chandran", "gender": "Male", "dob": "1990-06-12", "state": "Tamil Nadu", "district": "Chengalpattu", "taluk": "Tambaram", "village": "Tambaram", "pin": "600045", "door": "No. 29", "street": "GST Road", "area": "West Tambaram", "phone": "9840112233", "email": "deepak.b@digiland.demo", "aadhaar": "9911-2507-3761"},
    {"name": "Kavitha Selvakumar", "father": "Selvakumar Velu", "gender": "Female", "dob": "1984-10-03", "state": "Tamil Nadu", "district": "Tiruvallur", "taluk": "Ambattur", "village": "Ambattur", "pin": "600053", "door": "Plot 55", "street": "Industrial Estate Road", "area": "Ambattur", "phone": "9840223344", "email": "kavitha.s@digiland.demo", "aadhaar": "9912-2644-4012"}
]

# Regional location templates
REGIONAL_LOCALITIES = [
    {"state": "Tamil Nadu", "district": "Chennai", "taluk": "Mylapore", "village": "Mylapore", "pin": "600004", "lat": 13.0338, "lon": 80.2676, "class": "Grama Natham Residential Plot", "cat": "Residential"},
    {"state": "Tamil Nadu", "district": "Chennai", "taluk": "Mylapore", "village": "Alwarpet", "pin": "600018", "lat": 13.0365, "lon": 80.2524, "class": "Ryotwari Dry Land (Punja)", "cat": "Residential"},
    {"state": "Tamil Nadu", "district": "Chennai", "taluk": "Guindy", "village": "Velachery", "pin": "600042", "lat": 12.9815, "lon": 80.2180, "class": "Commercial Complex Layout", "cat": "Commercial"},
    {"state": "Tamil Nadu", "district": "Chennai", "taluk": "Mylapore", "village": "Mandaveli", "pin": "600028", "lat": 13.0270, "lon": 80.2610, "class": "Ryotwari Wet Land (Nanja)", "cat": "Residential"},
    {"state": "Tamil Nadu", "district": "Chennai", "taluk": "Mylapore", "village": "Triplicane", "pin": "600005", "lat": 13.0588, "lon": 80.2757, "class": "Grama Natham Built-up", "cat": "Residential"},
    {"state": "Tamil Nadu", "district": "Chennai", "taluk": "Alandur", "village": "Adyar", "pin": "600020", "lat": 13.0012, "lon": 80.2565, "class": "Prime Residential Layout", "cat": "Residential"},
    {"state": "Tamil Nadu", "district": "Chennai", "taluk": "Egmore", "village": "Anna Nagar", "pin": "600040", "lat": 13.0850, "lon": 80.2100, "class": "Commercial Plaza Land", "cat": "Commercial"},
    {"state": "Tamil Nadu", "district": "Chengalpattu", "taluk": "Tambaram", "village": "Tambaram", "pin": "600045", "lat": 12.9249, "lon": 80.1000, "class": "Ryotwari Dry Land (Punja)", "cat": "Residential"},
    {"state": "Tamil Nadu", "district": "Chengalpattu", "taluk": "Sholinganallur", "village": "Sholinganallur", "pin": "600119", "lat": 12.9010, "lon": 80.2279, "class": "IT Corridor Commercial Zone", "cat": "Commercial"},
    {"state": "Tamil Nadu", "district": "Coimbatore", "taluk": "Coimbatore North", "village": "Saravanampatti", "pin": "641035", "lat": 11.0805, "lon": 76.9958, "class": "Agricultural Wet Land (Nanja)", "cat": "Agricultural"},
    {"state": "Tamil Nadu", "district": "Coimbatore", "taluk": "Coimbatore South", "village": "Peelamedu", "pin": "641004", "lat": 11.0260, "lon": 77.0125, "class": "Industrial Layout", "cat": "Commercial"},
    {"state": "Tamil Nadu", "district": "Salem", "taluk": "Salem West", "village": "Hasthampatti", "pin": "636007", "lat": 11.6744, "lon": 78.1460, "class": "Agricultural Dry Land (Punja)", "cat": "Agricultural"},
    {"state": "Tamil Nadu", "district": "Madurai", "taluk": "Madurai South", "village": "Villapuram", "pin": "625012", "lat": 9.8970, "lon": 78.1250, "class": "Grama Natham Residential Plot", "cat": "Residential"},
    {"state": "Tamil Nadu", "district": "Tiruchirappalli", "taluk": "Srirangam", "village": "Cantonment", "pin": "620001", "lat": 10.7905, "lon": 78.6924, "class": "Commercial Plaza Layout", "cat": "Commercial"},
    {"state": "Tamil Nadu", "district": "Tirunelveli", "taluk": "Palayamkottai", "village": "Vannarpettai", "pin": "627003", "lat": 8.7280, "lon": 77.7274, "class": "Ryotwari Wet Land (Nanja)", "cat": "Agricultural"},
    {"state": "Karnataka", "district": "Bengaluru Urban", "taluk": "Bengaluru South", "village": "Koramangala", "pin": "560034", "lat": 12.9352, "lon": 77.6245, "class": "Converted Commercial Plot (A-Khata)", "cat": "Commercial"},
    {"state": "Karnataka", "district": "Bengaluru Urban", "taluk": "Bengaluru East", "village": "Whitefield", "pin": "560066", "lat": 12.9698, "lon": 77.7500, "class": "Converted Residential Layout", "cat": "Residential"},
    {"state": "Karnataka", "district": "Bengaluru Urban", "taluk": "Bengaluru North", "village": "Yelahanka", "pin": "560064", "lat": 13.1007, "lon": 77.5963, "class": "Agricultural Dry Land (B-Khata)", "cat": "Agricultural"},
    {"state": "Maharashtra", "district": "Pune", "taluk": "Haveli", "village": "Aundh", "pin": "411007", "lat": 18.5580, "lon": 73.8075, "class": "Non-Agricultural Residential (NA)", "cat": "Residential"},
    {"state": "Maharashtra", "district": "Pune", "taluk": "Haveli", "village": "Baner", "pin": "411045", "lat": 18.5590, "lon": 73.7868, "class": "NA Commercial Tech Layout", "cat": "Commercial"},
    {"state": "Kerala", "district": "Ernakulam", "taluk": "Kanayannur", "village": "Kakkanad", "pin": "682030", "lat": 10.0159, "lon": 76.3419, "class": "Purayidam Residential Plot", "cat": "Residential"},
    {"state": "Telangana", "district": "Hyderabad", "taluk": "Serilingampally", "village": "Gachibowli", "pin": "500032", "lat": 17.4401, "lon": 78.3489, "class": "Commercial IT Corridor Plot", "cat": "Commercial"}
]

# 6 Officer accounts
OFFICER_PROFILES = [
    {
        "email": "officer@digiland.gov.in",
        "full_name": "Dr. K. Ananthakrishnan",
        "password": "Officer@123",
        "officer_code": "REV-TN-CHE-001",
        "badge_number": "TAH-9921",
        "designation": "Tahsildar & Sub-Divisional Magistrate (Level 1 Reviewer)",
        "department": "Revenue & Land Administration",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "taluk": "Mylapore",
        "permissions": ["VIEW_RECORDS", "VERIFY_DOCUMENTS", "APPROVE_DOCUMENTS", "REJECT_DOCUMENTS", "EDIT_EXTRACTED_DATA", "VIEW_GIS", "VIEW_AUDIT_LOGS"]
    },
    {
        "email": "senior.officer@digiland.gov.in",
        "full_name": "Smt. K. Vasanthi, IAS",
        "password": "Officer@123",
        "officer_code": "REV-TN-HQ-002",
        "badge_number": "DRO-8834",
        "designation": "Senior Verification Officer & Revenue Divisional Officer (Level 2 Reviewer)",
        "department": "Revenue & Land Administration",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "taluk": "Guindy",
        "permissions": ["VIEW_RECORDS", "VERIFY_DOCUMENTS", "APPROVE_DOCUMENTS", "REJECT_DOCUMENTS", "EDIT_EXTRACTED_DATA", "VIEW_GIS", "VIEW_AUDIT_LOGS", "MANAGE_USERS"]
    },
    {
        "email": "dro.chennai@digiland.gov.in",
        "full_name": "Thiru R. Balasubramanian",
        "password": "Officer@123",
        "officer_code": "REV-TN-DRO-003",
        "badge_number": "DRO-5510",
        "designation": "District Revenue Officer (DRO Chennai - Level 2 Final Authority)",
        "department": "District Revenue Administration",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "taluk": "Mylapore",
        "permissions": ["VIEW_RECORDS", "VERIFY_DOCUMENTS", "APPROVE_DOCUMENTS", "REJECT_DOCUMENTS", "VIEW_GIS", "VIEW_AUDIT_LOGS"]
    },
    {
        "email": "gis.officer@digiland.gov.in",
        "full_name": "Er. S. Mohan Kumar",
        "password": "Officer@123",
        "officer_code": "SUR-TN-GIS-004",
        "badge_number": "GIS-7731",
        "designation": "Assistant Director of Survey & Land Records (GIS Specialist)",
        "department": "Survey & Settlement Department",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "taluk": "Egmore",
        "permissions": ["VIEW_RECORDS", "VIEW_GIS", "EDIT_EXTRACTED_DATA"]
    },
    {
        "email": "val.officer@digiland.gov.in",
        "full_name": "Smt. V. Priya",
        "password": "Officer@123",
        "officer_code": "REV-TN-VAL-005",
        "badge_number": "VAL-3320",
        "designation": "Document Validation & Fraud Anomaly Detection Officer",
        "department": "Revenue Vigilance & Audits",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "taluk": "Alandur",
        "permissions": ["VIEW_RECORDS", "VERIFY_DOCUMENTS", "EDIT_EXTRACTED_DATA", "VIEW_AUDIT_LOGS"]
    },
    {
        "email": "admin@digiland.gov.in",
        "full_name": "System Security Administrator",
        "password": "Admin@123",
        "officer_code": "SEC-SYS-ADM-006",
        "badge_number": "ADM-0001",
        "designation": "State Land Governance System Administrator",
        "department": "Information Technology & Governance",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "taluk": "Secretariat",
        "permissions": ["ALL"]
    }
]

def reset_and_seed_demo_database(db: Session, force_reset: bool = True) -> dict:
    """
    Safely resets all demo/synthetic records and seeds a 65+ record interconnected dataset
    supporting Fraud Analysis, Blockchain Integrity, QR Verification, Multi-Level Approvals,
    Disputes, Security Monitoring, and Structured Document Details.
    """
    summary = {}

    existing_count = db.query(MockAadhaarProfile).count()
    if not force_reset and existing_count >= 50:
        print(f"[INIT] Database already contains {existing_count} demo profiles. Skipping re-seeding on startup.")
        return {
            "status": "ALREADY_SEEDED",
            "mock_aadhaar_created": existing_count,
            "citizen_users_created": db.query(User).filter(User.role == "CITIZEN").count()
        }
    
    # Otherwise perform clean wipe before seeding
    print("[DATABASE RESET] Safely cleaning existing demo records...")
    db.query(SecurityEvent).delete()
    db.query(LoginHistory).delete()
    db.query(DeviceSession).delete()
    db.query(SuspiciousActivity).delete()
    db.query(DisputeTimeline).delete()
    db.query(DisputeEvidence).delete()
    db.query(DisputeCase).delete()
    db.query(ApprovalHistory).delete()
    db.query(ApprovalWorkflow).delete()
    db.query(QRVerificationToken).delete()
    db.query(IntegrityAuditChain).delete()
    db.query(DocumentRiskScore).delete()
    db.query(FraudAnalysisResult).delete()
    db.query(DocumentExtractedDetails).delete()
    db.query(AuditLog).delete()
    db.query(Notification).delete()
    db.query(EmailDeliveryLog).delete()
    db.query(CaptchaAttempt).delete()
    db.query(OTPRequest).delete()
    db.query(IdentityVerification).delete()
    db.query(StorageFile).delete()
    db.query(DocumentEncryptionMetadata).delete()
    db.query(UserStorageQuota).delete()
    db.query(GISData).delete()
    db.query(VerificationRecord).delete()
    db.query(ValidationResult).delete()
    db.query(DuplicateRecord).delete()
    db.query(ExtractedField).delete()
    db.query(OCRResult).delete()
    db.query(DocumentVersion).delete()
    db.query(LandRecord).delete()
    db.query(Document).delete()
    db.query(GovernmentOfficer).delete()
    db.query(MockAadhaarProfile).delete()
    db.query(User).delete()
    db.commit()

    # 1. Seed 65 Mock Aadhaar Profiles
    print("[SEEDING] Creating 65+ Mock Aadhaar Profiles with Phone Numbers...")
    mock_aadhaar_records = []
    for p_data in DEMO_SYNTHETIC_AADHAAR_PROFILES:
        p = MockAadhaarProfile(
            aadhaar_number=p_data["aadhaar_number"],
            full_name=p_data["full_name"],
            date_of_birth=p_data["date_of_birth"],
            gender=p_data["gender"],
            address=p_data["address"],
            village=p_data["village"],
            taluk=p_data["taluk"],
            district=p_data["district"],
            state=p_data["state"],
            pincode=p_data["pincode"],
            phone_number=p_data["phone_number"],
            email=p_data["email"],
            verification_status="VERIFIED",
            is_demo_data=True
        )
        db.add(p)
        mock_aadhaar_records.append(p)

    for i in range(len(mock_aadhaar_records), 65):
        loc = REGIONAL_LOCALITIES[i % len(REGIONAL_LOCALITIES)]
        synth_aadhaar = f"99{(i+1):02d}-{(2000+i*37):04d}-{(4000+i*13):04d}"
        p = MockAadhaarProfile(
            aadhaar_number=synth_aadhaar,
            full_name=f"Citizen Persona {i+1}",
            date_of_birth=f"1985-05-{(i%28)+1:02d}",
            gender="Female" if i % 2 == 0 else "Male",
            address=f"Plot {i+1}, Main Road, {loc['village']}",
            village=loc["village"],
            taluk=loc["taluk"],
            district=loc["district"],
            state=loc["state"],
            pincode=loc["pin"],
            phone_number=f"9840{(i*1317)%899999 + 100000}",
            email=f"citizen{i+1}@digiland.demo",
            verification_status="VERIFIED",
            is_demo_data=True
        )
        db.add(p)
        mock_aadhaar_records.append(p)
    
    db.commit()
    summary["mock_aadhaar_created"] = len(mock_aadhaar_records)

    # 2. Seed Citizen Users with Matching Phone Numbers
    print("[SEEDING] Creating Citizen Users and Officers...")
    citizen_users = []
    for idx, c in enumerate(SYNTHETIC_CITIZENS):
        u = User(
            full_name=c["name"],
            email=c["email"],
            phone=c["phone"],
            age=35 + (idx * 2),
            aadhaar_hash=deterministic_aadhaar_hash(c["aadhaar"].replace("-", "")),
            aadhaar_masked=f"XXXX-XXXX-{c['aadhaar'][-4:]}",
            hashed_password=get_password_hash(c.get("password", "Citizen@123")),
            role="CITIZEN",
            is_active=True,
            is_verified=True,
            verification_status="VERIFIED",
            storage_quota_mb=1024,
            storage_used_bytes=1048576 * (idx + 1),
            preferred_language="en"
        )
        db.add(u)
        citizen_users.append(u)
    db.commit()

    # Seed 6 Officers
    officer_users = []
    for off in OFFICER_PROFILES:
        u_off = User(
            full_name=off["full_name"],
            email=off["email"],
            phone=f"9841{random.randint(100000, 999999)}",
            age=45,
            aadhaar_hash=deterministic_aadhaar_hash(f"9902{random.randint(1000, 9999)}9901"),
            aadhaar_masked="XXXX-XXXX-9901",
            hashed_password=get_password_hash(off["password"]),
            role="GOVERNMENT_OFFICER" if "admin" not in off["email"] else "ADMIN",
            is_active=True,
            is_verified=True,
            verification_status="VERIFIED",
            storage_quota_mb=5120,
            preferred_language="en"
        )
        db.add(u_off)
        db.commit()
        db.refresh(u_off)
        officer_users.append(u_off)

        gov_prof = GovernmentOfficer(
            user_id=u_off.id,
            officer_code=off["officer_code"],
            badge_number=off["badge_number"],
            designation=off["designation"],
            department=off["department"],
            state=off["state"],
            district=off["district"],
            taluk=off["taluk"],
            jurisdiction_scope=json.dumps([off["taluk"], "District Cadastre Records"]),
            is_authorized=True,
            total_verifications_completed=120 + random.randint(10, 80)
        )
        db.add(gov_prof)
    db.commit()

    summary["citizen_users_created"] = len(citizen_users)
    summary["officer_users_created"] = len(officer_users)

    # 3. Seed 65+ Connected Land Records, Documents, Fraud, Blockchain, QR, Approvals, Disputes
    print("[SEEDING] Creating 65+ Connected Records (Land, OCR, Details, Fraud, Blockchain, QR, Approvals)...")
    
    STATUS_DISTRIBUTION = [
        "VERIFIED", "VERIFIED", "VERIFIED", "VERIFIED",
        "PENDING", "PENDING", 
        "VERIFICATION_REQUIRED", "VERIFICATION_REQUIRED",
        "DUPLICATE_SUSPECTED",
        "POTENTIALLY_ALTERED",
        "CORRECTION_REQUESTED",
        "REJECTED"
    ]

    DOC_TYPES = [
        ("PATTA_CHITTA", "Patta / Chitta Extract (Form 11)"),
        ("SALE_DEED", "Deed of Absolute Conveyance (Sale Deed)"),
        ("ENCUMBRANCE_CERTIFICATE", "Encumbrance Certificate (EC Form 15)"),
        ("MUTATION_RECORD", "Revenue Mutation & Jamabandi Extract"),
        ("SETTLEMENT_DEED", "Family Property Settlement Deed"),
        ("PARTITION_DEED", "Registered Deed of Partition"),
        ("TAX_RECEIPT", "Land Revenue & Property Tax Receipt"),
        ("SURVEY_SKETCH", "Field Measurement Book (FMB) Sketch")
    ]

    created_docs = []
    created_lands = []
    created_gis = []

    primary_citizen = citizen_users[0]
    assigned_officer = officer_users[0]
    senior_officer = officer_users[1]

    for i in range(65):
        loc = REGIONAL_LOCALITIES[i % len(REGIONAL_LOCALITIES)]
        owner = citizen_users[i % len(citizen_users)]
        doc_type_key, doc_type_name = DOC_TYPES[i % len(DOC_TYPES)]
        status = STATUS_DISTRIBUTION[i % len(STATUS_DISTRIBUTION)]
        
        survey_main = (i * 17) % 450 + 1
        subdiv = chr(65 + (i % 4))
        survey_num = f"{survey_main}/{subdiv}"
        patta_num = f"PATTA-{(2000 + i * 37)}"
        khasra_num = f"KH-{(500 + i * 13)}"
        khata_num = f"KT-{(100 + i * 7)}"
        parcel_id = f"IND-{loc['state'][:2].upper()}-{loc['district'][:3].upper()}-2026-{(i+1):04d}"
        area_sqft = float(1200 + (i * 240) % 8000)
        
        width_ft = 30 + (i % 5) * 10
        length_ft = int(area_sqft / width_ft)
        dim_str = f"North: {width_ft}ft, South: {width_ft}ft, East: {length_ft}ft, West: {length_ft}ft"
        
        north_b = f"Survey {survey_main}/{(chr(65 + (i+1)%4))} (Plot {i+2})"
        south_b = f"{(20 + (i%3)*10)}ft Wide Revenue Road"
        east_b = f"Vacant Land Survey {survey_main + 1}"
        west_b = f"Residential Building Survey {survey_main - 1 if survey_main > 1 else 99}"

        doc_num = f"DOC-{loc['state'][:2].upper()}-2026-{(i+1001):04d}"
        doc_title = f"{doc_type_name} - Survey {survey_num}, {loc['village']}"

        # 3.1 Document Entity
        doc = Document(
            user_id=owner.id,
            document_number=doc_num,
            title=doc_title,
            document_type=doc_type_key,
            current_version=1 if status != "VERIFICATION_REQUIRED" else 2,
            status=status,
            file_path=f"uploads/documents/{doc_num}_synthetic_deed.pdf.enc",
            file_type="application/pdf",
            file_size=1024 * (500 + (i * 73) % 2000),
            original_filename=f"{doc_num.lower()}_deed.pdf",
            is_locked=(status == "VERIFIED"),
            is_encrypted=True
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        created_docs.append(doc)

        # 3.2 Encryption Metadata
        enc_meta = DocumentEncryptionMetadata(
            document_id=doc.id,
            encryption_algo="AES-256-GCM",
            nonce_base64="ZGVtb19ub25jZV8xMmJ5dGVzIQ==",
            key_id="AES256-GCM-PRIMARY",
            original_size=doc.file_size,
            file_size_encrypted=doc.file_size + 28
        )
        db.add(enc_meta)

        # 3.3 Document Version
        file_hash = f"sha256_{(i+1)*9999999:016x}abcdef0123456789"
        v1 = DocumentVersion(
            document_id=doc.id,
            version_number=1,
            file_path=doc.file_path,
            file_hash=file_hash,
            uploaded_by=owner.id,
            change_summary="Initial upload and AI OCR digitization",
            diff_detected=(status == "POTENTIALLY_ALTERED"),
            officer_review_needed=(status in ("VERIFICATION_REQUIRED", "POTENTIALLY_ALTERED", "DUPLICATE_SUSPECTED"))
        )
        db.add(v1)

        # 3.4 OCR Result
        base_conf = 72.0 if (status in ("VERIFICATION_REQUIRED", "POTENTIALLY_ALTERED")) else 97.5
        ocr_text = (
            f"GOVERNMENT DEMO REVENUE ARCHIVE\nState: {loc['state']} | District: {loc['district']} | Taluk: {loc['taluk']}\n"
            f"Village: {loc['village']} | Survey No: {survey_num} | Patta No: {patta_num}\n"
            f"Pattadhar Name: {owner.full_name} | Father's Name: {SYNTHETIC_CITIZENS[i % len(SYNTHETIC_CITIZENS)]['father']}\n"
            f"Classification: {loc['class']} | Area: {area_sqft:.0f} Sq.Ft\n"
            f"Door No: No. {(i*7)%100 + 1} | Street: Street {(i%10)+1}, {loc['village']} | Pincode: {loc['pin']}\n"
            f"Registration No: {doc_num} | Date: 15/08/2026\n"
            f"[DEMO / SYNTHETIC DATA — NOT VALID FOR LEGAL OR GOVERNMENT USE]"
        )
        ocr_res = OCRResult(
            document_id=doc.id,
            raw_text=ocr_text,
            engine_used="DIGILAND_NEURAL_OCR_v2",
            processing_time_ms=280 + (i * 11) % 150,
            overall_confidence=base_conf
        )
        db.add(ocr_res)

        # 3.5 Extracted Fields (17 Fields)
        is_low_conf = (status in ("VERIFICATION_REQUIRED", "POTENTIALLY_ALTERED"))
        fields = [
            ExtractedField(document_id=doc.id, field_name="owner_name", field_label="Owner Name", field_value=owner.full_name, confidence_score=base_conf, requires_human_verification=is_low_conf),
            ExtractedField(document_id=doc.id, field_name="parent_guardian_name", field_label="Father / Guardian Name", field_value=SYNTHETIC_CITIZENS[i % len(SYNTHETIC_CITIZENS)]["father"], confidence_score=base_conf + 1.2, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="survey_number", field_label="Survey Number", field_value=survey_num, confidence_score=base_conf + 0.8, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="subdivision_number", field_label="Subdivision", field_value=subdiv, confidence_score=98.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="patta_number", field_label="Patta Number", field_value=patta_num, confidence_score=96.5, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="khasra_number", field_label="Khasra Number", field_value=khasra_num, confidence_score=94.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="khata_number", field_label="Khata Number", field_value=khata_num, confidence_score=95.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="plot_number", field_label="Plot Number", field_value=f"Plot {(i%40)+1}", confidence_score=91.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="land_area", field_label="Land Area", field_value=f"{area_sqft:.0f} Sq.Ft", confidence_score=base_conf - 2.0 if is_low_conf else 96.0, requires_human_verification=is_low_conf),
            ExtractedField(document_id=doc.id, field_name="land_dimensions", field_label="Dimensions", field_value=dim_str, confidence_score=89.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="land_classification", field_label="Classification", field_value=loc["class"], confidence_score=97.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="village", field_label="Village / Locality", field_value=loc["village"], confidence_score=99.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="taluk", field_label="Taluk / Tehsil", field_value=loc["taluk"], confidence_score=99.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="district", field_label="District", field_value=loc["district"], confidence_score=99.5, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="state", field_label="State", field_value=loc["state"], confidence_score=99.8, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="registration_office", field_label="Sub-Registrar Office", field_value=f"{loc['taluk']} SRO", confidence_score=98.0, requires_human_verification=False),
            ExtractedField(document_id=doc.id, field_name="document_number", field_label="Document Number", field_value=doc_num, confidence_score=99.0, requires_human_verification=False)
        ]
        db.add_all(fields)

        # 3.6 Structured DocumentExtractedDetails (for "Get Document Details" feature)
        extraction_res = document_details_service.extract_structured_details(ocr_text, doc_type_key)
        doc_details_rec = DocumentExtractedDetails(
            document_id=doc.id,
            document_type=extraction_res["document_type"],
            document_title=extraction_res["document_title"],
            document_number=doc_num,
            registration_number=doc_num,
            document_date="15/08/2026",
            owner_name=owner.full_name,
            parent_guardian_name=SYNTHETIC_CITIZENS[i % len(SYNTHETIC_CITIZENS)]["father"],
            survey_number=survey_num,
            subdivision_number=subdiv,
            patta_number=patta_num,
            plot_number=f"Plot {(i%40)+1}",
            khata_number=khata_num,
            khasra_number=khasra_num,
            door_number=f"No. {(i*7)%100 + 1}",
            street_name=f"Street {(i%10)+1}, {loc['village']}",
            address=f"No. {(i*7)%100 + 1}, Street {(i%10)+1}, {loc['village']}, {loc['district']}",
            village=loc["village"],
            taluk=loc["taluk"],
            district=loc["district"],
            state=loc["state"],
            pincode=loc["pin"],
            land_area=f"{area_sqft:.0f} Sq.Ft",
            land_classification=loc["class"],
            extracted_data=extraction_res["fields"],
            confidence_data=extraction_res["summary"],
            is_confirmed=(status == "VERIFIED")
        )
        db.add(doc_details_rec)

        # 3.7 AI Fraud Analysis & Risk Score
        fraud_detection_service.analyze_document_fraud(db, doc)

        # 3.8 Blockchain-Inspired Tamper-Evident Audit Chain Block
        integrity_service.record_document_block(
            db=db,
            document_id=doc.id,
            version_number=1,
            file_hash=file_hash,
            action="DOCUMENT_DIGITIZED",
            user_id=owner.id,
            user_role=owner.role
        )

        # 3.9 Multi-Level Approval Workflow
        wf = multi_level_approval_service.initialize_workflow(db, doc)
        if status == "VERIFIED":
            wf.status = "Approved"
            wf.final_decision = "APPROVED"
            wf.final_remarks = f"Approved after cadastral and revenue cross-verification in {loc['taluk']} SRO."
            wf.completed_at = datetime.datetime.now(datetime.timezone.utc)
            # Create QR Verification Token for verified certificate
            qr_verification_service.generate_verification_token(db, doc)
        elif status == "REJECTED":
            wf.status = "Rejected"
            wf.final_decision = "REJECTED"
            wf.final_remarks = "Boundary variance exceeds statutory allowance."
            wf.completed_at = datetime.datetime.now(datetime.timezone.utc)
        elif status in ("VERIFICATION_REQUIRED", "POTENTIALLY_ALTERED"):
            wf.current_level = 2
            wf.status = "Escalated"
            wf.escalation_reason = "Elevated risk index requires Level 2 Senior Officer scrutiny."

        # 3.10 Land Record Relational Entity
        is_building = (i % 2 == 0)
        lr = LandRecord(
            document_id=doc.id,
            user_id=owner.id,
            survey_number=survey_num,
            subdivision_number=subdiv,
            patta_number=patta_num,
            khasra_number=khasra_num,
            khata_number=khata_num,
            plot_number=f"Plot {(i%40)+1}",
            land_parcel_id=parcel_id,
            owner_name=owner.full_name,
            parent_guardian_name=SYNTHETIC_CITIZENS[i % len(SYNTHETIC_CITIZENS)]["father"],
            ownership_type="Single Owner (Ryotwari Patta)" if (i % 3 != 0) else "Joint Ownership (50% Share)",
            ownership_share="100% Full Ownership" if (i % 3 != 0) else "50% Co-Sharer",
            contact_phone=owner.phone,
            land_classification=loc["class"],
            land_category=loc["cat"],
            land_area=area_sqft,
            area_unit="Sq.Ft",
            land_dimensions=dim_str,
            north_boundary=north_b,
            south_boundary=south_b,
            east_boundary=east_b,
            west_boundary=west_b,
            door_number=f"No. {(i*7)%100 + 1}" if is_building else None,
            building_name=f"{owner.full_name.split()[0]} Enclave" if is_building else None,
            street_name=f"Street {(i%10)+1}, {loc['village']}",
            area_locality=loc["village"],
            village=loc["village"],
            taluk=loc["taluk"],
            district=loc["district"],
            state=loc["state"],
            pincode=loc["pin"],
            status=status,
            is_synthetic_demo=True,
            demo_watermark="SYNTHETIC DEMO RECORD — NOT A GOVERNMENT DOCUMENT"
        )
        db.add(lr)
        db.commit()
        db.refresh(lr)
        created_lands.append(lr)

        # 3.11 GIS Spatial Parcel Geometry
        base_lat = loc["lat"] + ((i % 10) - 5) * 0.0012
        base_lon = loc["lon"] + ((i % 8) - 4) * 0.0012
        polygon_geo = GISService.generate_parcel_geometry(base_lat, base_lon, area_sqft)

        gis = GISData(
            land_record_id=lr.id,
            parcel_id=parcel_id,
            survey_number=survey_num,
            subdivision_number=subdiv,
            patta_number=patta_num,
            street_name=lr.street_name,
            village=loc["village"],
            taluk=loc["taluk"],
            district=loc["district"],
            latitude=base_lat,
            longitude=base_lon,
            boundary_polygon_geojson=polygon_geo,
            area_sqft=area_sqft,
            zone_type=loc["cat"],
            nearby_roads=f"{loc['village']} Main Road, Revenue Road {(i%4)+1}",
            is_synthetic_demo=True
        )
        db.add(gis)
        created_gis.append(gis)

    # 4. Seed 3 Sample Citizen Land Disputes
    print("[SEEDING] Creating Sample Land Disputes & Grievances...")
    dispute_samples = [
        {"title": "Boundary Demarcation Discrepancy", "desc": "Southern survey fence overlaps with adjacent road widening boundary.", "cat": "BOUNDARY_DISPUTE", "survey": "142/3A", "village": "Mylapore", "taluk": "Mylapore", "district": "Chennai", "status": "Under Review", "priority": "High"},
        {"title": "Unauthorized Encroachment on Western Corner", "desc": "Temporary construction erected on private patta land without sanction.", "cat": "ENCROACHMENT", "survey": "305/1C", "village": "Villapuram", "taluk": "Madurai South", "district": "Madurai", "status": "Submitted", "priority": "Urgent"},
        {"title": "Inheritance Mutation Grievance", "desc": "Application for legal heir name inclusion in Patta register pending officer order.", "cat": "INHERITANCE_ISSUE", "survey": "88/2B", "village": "Saravanampatti", "taluk": "Coimbatore North", "district": "Coimbatore", "status": "Resolved", "priority": "Medium"}
    ]
    for d_idx, d in enumerate(dispute_samples):
        c_user = citizen_users[d_idx]
        case = DisputeCase(
            case_number=f"DSP-TN-2026-{(d_idx+1):04d}",
            citizen_id=c_user.id,
            survey_number=d["survey"],
            village=d["village"],
            taluk=d["taluk"],
            district=d["district"],
            state="Tamil Nadu",
            title=d["title"],
            description=d["desc"],
            category=d["cat"],
            status=d["status"],
            priority=d["priority"],
            assigned_officer_id=assigned_officer.id
        )
        db.add(case)
        db.commit()
        db.refresh(case)

        t_event = DisputeTimeline(
            dispute_id=case.id,
            actor_id=c_user.id,
            actor_role=c_user.role,
            action="DISPUTE_SUBMITTED",
            status_changed_to=d["status"],
            remarks="Case registered on citizen dispute grievance portal."
        )
        db.add(t_event)

    # 5. Seed Security Monitoring Events & Login History
    print("[SEEDING] Creating Security Monitoring Events & Active Sessions...")
    for u in citizen_users[:3]:
        # Active session
        DeviceSession(
            user_id=u.id,
            session_token_hash=f"session_hash_{u.id}_2026_demo",
            device_name="Chrome on Windows 11",
            device_type="Desktop",
            ip_address="192.168.1.45",
            is_active=True,
            expires_at=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        )
        # Login history
        LoginHistory(
            user_id=u.id,
            user_email=u.email,
            ip_address="192.168.1.45",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            is_successful=True
        )
    
    # Add an example security event
    sec_ev = SecurityEvent(
        event_type="UNUSUAL_GEO_LOGIN",
        severity="MEDIUM",
        user_id=citizen_users[1].id,
        user_email=citizen_users[1].email,
        ip_address="203.0.113.195",
        details={"message": "New device login detected from alternate IP subnet."}
    )
    db.add(sec_ev)

    # 6. Seed Personal Storage Vault Files for Primary Citizen
    storage_categories = [
        ("Land Documents", "Patta_Extract_Survey_142_3A.pdf", 1024 * 750),
        ("Identity Documents", "Aadhaar_Card_Copy_Masked.pdf", 1024 * 320),
        ("Tax Receipts", "Property_Tax_Receipt_2025_2026.pdf", 1024 * 180),
        ("Mutation Papers", "Tahsildar_Mutation_Sanction_Order.pdf", 1024 * 512),
        ("Survey Sketches", "FMB_Field_Measurement_Sketch_142.pdf", 1024 * 890)
    ]
    for cat, fname, fsize in storage_categories:
        sf = StorageFile(
            user_id=primary_citizen.id,
            file_name=f"{fname}.enc",
            original_name=fname,
            file_path=f"uploads/storage/{fname}.enc",
            file_size=fsize,
            mime_type="application/pdf",
            folder_category=cat,
            description=f"Synthetic demo {cat.lower()} archive file",
            is_encrypted=True
        )
        db.add(sf)

    db.commit()

    summary["documents_created"] = len(created_docs)
    summary["land_records_created"] = len(created_lands)
    summary["gis_parcels_created"] = len(created_gis)
    summary["disputes_created"] = len(dispute_samples)
    summary["status_breakdown"] = {
        st: db.query(Document).filter(Document.status == st).count()
        for st in set(STATUS_DISTRIBUTION)
    }

    return summary

def seed_demo_data(db: Session, force_reset: bool = False):
    """Entrypoint used by lifespan / startup / CLI."""
    return reset_and_seed_demo_database(db, force_reset=force_reset)
