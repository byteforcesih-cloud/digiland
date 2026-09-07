import os
import uuid
import hashlib
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Request
from fastapi.responses import FileResponse, Response, StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.core.audit import log_audit_event
from app.models.user import User
from app.models.document import Document, DocumentVersion, ExtractedField, OCRResult
from app.models.document_details import DocumentExtractedDetails
from app.models.land import LandRecord, GISData
from app.models.verification import ValidationResult
from app.models.storage import DocumentEncryptionMetadata
from app.schemas.document import DocumentOut, DocumentVersionOut
from app.services.ocr_service import OCRService
from app.services.validation_service import ValidationService
from app.services.duplicate_service import DuplicateService
from app.services.gis_service import GISService
from app.services.notification_service import NotificationService
from app.services.document_encryption_service import encryption_service
from app.services.password_pdf_service import password_pdf_service
from app.services.email_service import email_service
from app.services.storage_service import StorageService
from app.services.document_details_service import document_details_service
from app.api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".tiff", ".tif"}

def _compute_sha256(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()

@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    document_type: str = Form("PATTA_CHITTA"),
    title: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Handles PDF, JPG, JPEG, PNG, TIFF multi-page scanned land document uploads:
    - Validates file type, size (max 25MB), and file signature magic bytes
    - Performs AES-256-GCM encrypted disk persistence
    - Performs OCR parsing and field extraction with confidence scores
    - Executes Automated Validation Rules & Duplicate Record Matching
    - Creates corresponding LandRecord & GIS parcel representation
    - Dispatches email notification
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, JPG, JPEG, PNG, TIFF"
        )

    file_content = await file.read()
    file_size = len(file_content)
    if file_size > settings.MAX_FILE_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds maximum 25 MB limit")

    if not StorageService.validate_file_signature(file_content, file.filename):
        raise HTTPException(status_code=400, detail="Invalid or malicious file signature detected.")

    random_num = uuid.uuid4().hex[:6].upper()
    doc_number = f"DOC-TN-{datetime.now().year}-{random_num}"
    unique_name = f"{doc_number}_{file.filename}"
    
    # 1. AES-256-GCM Encrypted Disk Storage
    enc_path, nonce_b64, enc_size = encryption_service.encrypt_and_save_file(
        file_content,
        settings.DOCUMENTS_DIR,
        unique_name
    )
    
    file_hash = _compute_sha256(file_content)

    # 2. Create Document Header
    new_doc = Document(
        user_id=current_user.id,
        document_number=doc_number,
        title=title or f"{document_type.replace('_', ' ').title()} - {file.filename}",
        document_type=document_type,
        current_version=1,
        status="PROCESSING",
        file_path=enc_path,
        file_type=file.content_type or f"application/{ext.replace('.', '')}",
        file_size=file_size,
        original_filename=file.filename,
        thumbnail_path=None,
        is_locked=False,
        is_encrypted=True
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # 3. Save Encryption Metadata
    enc_meta = DocumentEncryptionMetadata(
        document_id=new_doc.id,
        encryption_algo="AES-256-GCM",
        nonce_base64=nonce_b64,
        key_id="AES256-GCM-PRIMARY",
        original_size=file_size,
        file_size_encrypted=enc_size
    )
    db.add(enc_meta)

    # 4. Record Version 1
    version_1 = DocumentVersion(
        document_id=new_doc.id,
        version_number=1,
        file_path=enc_path,
        file_hash=file_hash,
        uploaded_by=current_user.id,
        change_summary="Initial upload with AES-256 encryption and AI OCR digitization",
        diff_detected=False,
        officer_review_needed=False
    )
    db.add(version_1)

    # 5. Perform AI OCR Processing
    ocr_data = OCRService.process_document(file_content, file.filename)
    
    ocr_result = OCRResult(
        document_id=new_doc.id,
        raw_text=ocr_data["raw_text"],
        engine_used=ocr_data["engine_used"],
        processing_time_ms=ocr_data["processing_time_ms"],
        overall_confidence=ocr_data["overall_confidence"]
    )
    db.add(ocr_result)

    # Add Extracted Fields
    extracted_model_fields: List[ExtractedField] = []
    for f in ocr_data["fields"]:
        ef = ExtractedField(
            document_id=new_doc.id,
            field_name=f["field_name"],
            field_label=f["field_label"],
            field_value=f["field_value"],
            confidence_score=f["confidence_score"],
            requires_human_verification=f["requires_human_verification"],
            bounding_box=f["bounding_box"],
            is_modified_by_officer=False
        )
        db.add(ef)
        extracted_model_fields.append(ef)
    
    db.commit()
    db.refresh(new_doc)

    # 6. Perform Data Validation Rules
    validation_res = ValidationService.validate_document_fields(db, new_doc.id, extracted_model_fields)
    v_record = ValidationResult(
        document_id=new_doc.id,
        status=validation_res["status"],
        error_count=validation_res["error_count"],
        warning_count=validation_res["warning_count"],
        validation_rules_passed=validation_res["validation_rules_passed"],
        validation_rules_total=validation_res["validation_rules_total"],
        mismatch_details=validation_res["mismatch_details"]
    )
    db.add(v_record)

    # 7. Check Duplicate Detection
    dup_record = DuplicateService.check_for_duplicates(db, new_doc.id, extracted_model_fields)

    # 8. Determine final document status
    has_low_conf = any(f.requires_human_verification for f in extracted_model_fields)
    if dup_record:
        new_doc.status = "DUPLICATE_SUSPECTED"
    elif validation_res["status"] == "INVALID":
        new_doc.status = "VERIFICATION_REQUIRED"
    elif has_low_conf or validation_res["status"] == "NEEDS_REVIEW":
        new_doc.status = "VERIFICATION_REQUIRED"
    else:
        new_doc.status = "PENDING"

    # 9. Create LandRecord and GIS spatial coordinates
    field_dict = {f.field_name: (f.field_value or "") for f in extracted_model_fields}
    owner_name = field_dict.get("owner_name", current_user.full_name)
    survey_no = field_dict.get("survey_number", f"SN-{random_num}")
    patta_no = field_dict.get("patta_number", f"PATTA-{random_num}")
    village = field_dict.get("village", "Mylapore")
    taluk = field_dict.get("taluk", "Mylapore")
    district = field_dict.get("district", "Chennai")
    
    area_digits = "".join([c for c in field_dict.get("land_area", "2400") if c.isdigit() or c == '.'])
    land_area_val = float(area_digits) if area_digits else 2400.0

    land_rec = LandRecord(
        document_id=new_doc.id,
        user_id=current_user.id,
        owner_name=owner_name,
        survey_number=survey_no,
        patta_number=patta_no,
        khasra_number=field_dict.get("khasra_number"),
        khata_number=field_dict.get("khata_number"),
        plot_number=field_dict.get("plot_number"),
        land_area=land_area_val,
        area_unit="Sq.Ft",
        land_dimensions=field_dict.get("land_dimensions"),
        village=village,
        taluk=taluk,
        district=district,
        state=field_dict.get("state", "Tamil Nadu"),
        registration_office=field_dict.get("registration_office", "Sub-Registrar Office"),
        registration_officer=field_dict.get("registration_officer"),
        previous_owner=field_dict.get("previous_owner"),
        status="PENDING_VERIFICATION"
    )
    db.add(land_rec)
    db.commit()
    db.refresh(land_rec)

    # Base coords
    base_lat = 13.0338 + (hash(survey_no) % 500) * 0.00005
    base_lon = 80.2676 + (hash(patta_no) % 500) * 0.00005
    polygon_geo = GISService.generate_parcel_geometry(base_lat, base_lon, land_area_val)

    gis_entry = GISData(
        land_record_id=land_rec.id,
        survey_number=survey_no,
        patta_number=patta_no,
        village=village,
        taluk=taluk,
        district=district,
        latitude=base_lat,
        longitude=base_lon,
        boundary_polygon_geojson=polygon_geo,
        area_sqft=land_area_val,
        zone_type="Residential"
    )
    db.add(gis_entry)

    # 10. In-App Notification & Email Delivery
    NotificationService.send_notification(
        db=db,
        user_id=current_user.id,
        title="Document Uploaded & Processed",
        message=f"Document '{new_doc.title}' has been processed with AI OCR (Confidence: {ocr_data['overall_confidence']}%). Status: {new_doc.status}.",
        notification_type="PROCESSING_COMPLETED",
        reference_type="DOCUMENT",
        reference_id=new_doc.id,
        channel="ALL",
        user_email=current_user.email,
        user_phone=current_user.phone
    )
    
    email_service.send_email_sync(
        db=db,
        recipient_email=current_user.email,
        template_type="DOCUMENT_UPLOADED",
        template_vars={"title": new_doc.title, "doc_number": doc_number},
        user_id=current_user.id
    )

    # 11. Audit Logging
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "")
    log_audit_event(
        db=db,
        action="DOCUMENT_UPLOAD",
        entity_type="DOCUMENT",
        entity_id=str(new_doc.id),
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role,
        ip_address=client_ip,
        user_agent=user_agent,
        details={
            "document_number": doc_number,
            "filename": file.filename,
            "ocr_confidence": ocr_data["overall_confidence"],
            "status": new_doc.status,
            "encrypted": True
        }
    )

    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.get("", response_model=List[DocumentOut])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Returns documents accessible by current user."""
    if current_user.role == "CITIZEN":
        docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.id.desc()).all()
    else:
        docs = db.query(Document).order_by(Document.id.desc()).all()
    return docs

@router.get("/{document_id}", response_model=DocumentOut)
def get_document_by_id(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role == "CITIZEN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied to this land record")

    return doc

@router.get("/{document_id}/download-protected-pdf")
def download_password_protected_pdf(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generates and returns a password-protected Land Record Certificate PDF.
    Password derived deterministically from: Survey Number + Landowner First Name.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role == "CITIZEN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied to this document certificate")

    # Fetch land record details
    lr = doc.land_record
    survey_no = lr.survey_number if lr else "142/3A"
    owner_name = lr.owner_name if lr else current_user.full_name
    village = lr.village if lr else "Mylapore"
    district = lr.district if lr else "Chennai"
    area = f"{lr.land_area} {lr.area_unit}" if lr else "2400 Sq.Ft"

    pdf_bytes, password, hint = password_pdf_service.generate_protected_certificate(
        document_number=doc.document_number,
        title=doc.title,
        document_type=doc.document_type,
        status=doc.status,
        version=doc.current_version,
        survey_number=survey_no,
        owner_name=owner_name,
        village=village,
        district=district,
        area=area
    )

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        action="DOCUMENT_DOWNLOAD_PROTECTED_PDF",
        entity_type="DOCUMENT",
        entity_id=str(doc.id),
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role,
        ip_address=client_ip,
        details={"doc_number": doc.document_number, "protected": True}
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="DigiLand_{doc.document_number}_Protected.pdf"',
            "X-Password-Hint": hint
        }
    )

@router.get("/{document_id}/password-hint")
def get_pdf_password_hint(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns the password hint instructions for authorized users before downloading protected PDF.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role == "CITIZEN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    lr = doc.land_record
    survey_no = lr.survey_number if lr else "142/3A"
    owner_name = lr.owner_name if lr else current_user.full_name
    
    password = password_pdf_service.derive_password(survey_no, owner_name)
    hint = password_pdf_service.get_password_instructions(survey_no, owner_name)
    
    return {
        "document_number": doc.document_number,
        "survey_number": survey_no,
        "owner_name": owner_name,
        "password_hint": hint,
        "example_format": f"SurveyNumber + First Name (e.g. '{password}')"
    }

@router.post("/{document_id}/update-version", response_model=DocumentOut)
async def update_document_version(
    document_id: int,
    request: Request,
    file: UploadFile = File(...),
    change_summary: str = Form("Updated land deed version with revised boundaries"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Citizen uploads an updated version of an existing land document.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role == "CITIZEN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    file_content = await file.read()
    unique_name = f"v{doc.current_version + 1}_{uuid.uuid4().hex[:8]}_{file.filename}"
    
    enc_path, nonce_b64, enc_size = encryption_service.encrypt_and_save_file(
        file_content,
        settings.DOCUMENTS_DIR,
        unique_name
    )

    file_hash = _compute_sha256(file_content)

    # 1. OCR new file
    ocr_data = OCRService.process_document(file_content, file.filename)
    new_fields_dict = {f["field_name"]: f["field_value"] for f in ocr_data["fields"]}

    # 2. Compare with existing extracted fields
    existing_fields = db.query(ExtractedField).filter(ExtractedField.document_id == doc.id).all()
    old_fields_dict = {f.field_name: f.field_value for f in existing_fields}

    diffs = {}
    for k, v in new_fields_dict.items():
        if k in old_fields_dict and old_fields_dict[k] != v:
            diffs[k] = {"old": old_fields_dict[k], "new": v}

    diff_detected = len(diffs) > 0
    officer_review_needed = diff_detected or (ocr_data["overall_confidence"] < settings.OCR_CONFIDENCE_THRESHOLD)

    # 3. Create new version entry
    next_version = doc.current_version + 1
    new_v_record = DocumentVersion(
        document_id=doc.id,
        version_number=next_version,
        file_path=enc_path,
        file_hash=file_hash,
        uploaded_by=current_user.id,
        change_summary=change_summary,
        diff_detected=diff_detected,
        diff_details=diffs if diffs else None,
        officer_review_needed=officer_review_needed
    )
    db.add(new_v_record)

    # 4. Update document state
    doc.current_version = next_version
    doc.file_path = enc_path
    doc.file_size = len(file_content)
    if officer_review_needed:
        doc.status = "VERIFICATION_REQUIRED"
    
    # 5. Update extracted fields
    db.query(ExtractedField).filter(ExtractedField.document_id == doc.id).delete()
    for f in ocr_data["fields"]:
        ef = ExtractedField(
            document_id=doc.id,
            field_name=f["field_name"],
            field_label=f["field_label"],
            field_value=f["field_value"],
            confidence_score=f["confidence_score"],
            requires_human_verification=f["requires_human_verification"],
            bounding_box=f["bounding_box"]
        )
        db.add(ef)

    # 6. Audit & Notification
    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        action="DOCUMENT_VERSION_UPDATE",
        entity_type="DOCUMENT",
        entity_id=str(doc.id),
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role,
        ip_address=client_ip,
        details={"version": next_version, "diffs_found": len(diffs), "officer_review_needed": officer_review_needed}
    )

    email_service.send_email_sync(
        db=db,
        recipient_email=current_user.email,
        template_type="DOCUMENT_UPLOADED",
        template_vars={"title": f"{doc.title} (v{next_version})", "doc_number": doc.document_number},
        user_id=current_user.id
    )

    db.commit()
    db.refresh(doc)
    return doc

class DocumentDetailsUpdateRequest(BaseModel):
    details: dict

@router.post("/{document_id}/extract-details")
def extract_document_details(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyzes existing document OCR text to extract structured Indian land administration details
    (Owner Name, Survey Number, Patta Number, Khasra, Khata, Village, Taluk, District, Area, etc.)
    Reuses existing OCR output without redundant compute and saves to DocumentExtractedDetails.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Ownership or Officer check
    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to access this document's details")

    # Fetch existing OCR text
    ocr_record = db.query(OCRResult).filter(OCRResult.document_id == doc.id).first()
    raw_text = ocr_record.raw_text if ocr_record and ocr_record.raw_text else ""
    
    # If no OCR text in OCRResult, construct from ExtractedFields or Title
    if not raw_text:
        fields = db.query(ExtractedField).filter(ExtractedField.document_id == doc.id).all()
        if fields:
            raw_text = "\n".join([f"{f.field_label}: {f.field_value}" for f in fields])
        else:
            raw_text = f"Document Title: {doc.title}\nDocument Number: {doc.document_number}\nDocument Type: {doc.document_type}"

    # Execute 4-level extraction
    extraction_result = document_details_service.extract_structured_details(raw_text, doc.document_type)

    # Persist or update in database
    extracted_record = db.query(DocumentExtractedDetails).filter(DocumentExtractedDetails.document_id == doc.id).first()
    if not extracted_record:
        extracted_record = DocumentExtractedDetails(
            document_id=doc.id,
            document_type=extraction_result["document_type"],
            document_title=extraction_result["document_title"],
            document_number=extraction_result["fields"].get("registration_number", {}).get("value"),
            registration_number=extraction_result["fields"].get("registration_number", {}).get("value"),
            document_date=extraction_result["fields"].get("document_date", {}).get("value"),
            owner_name=extraction_result["fields"].get("owner_name", {}).get("value"),
            parent_guardian_name=extraction_result["fields"].get("parent_guardian_name", {}).get("value"),
            survey_number=extraction_result["fields"].get("survey_number", {}).get("value"),
            subdivision_number=extraction_result["fields"].get("subdivision_number", {}).get("value"),
            patta_number=extraction_result["fields"].get("patta_number", {}).get("value"),
            plot_number=extraction_result["fields"].get("plot_number", {}).get("value"),
            khata_number=extraction_result["fields"].get("khata_number", {}).get("value"),
            khasra_number=extraction_result["fields"].get("khasra_number", {}).get("value"),
            door_number=extraction_result["fields"].get("door_number", {}).get("value"),
            street_name=extraction_result["fields"].get("street_name", {}).get("value"),
            address=extraction_result["fields"].get("address", {}).get("value"),
            village=extraction_result["fields"].get("village", {}).get("value"),
            taluk=extraction_result["fields"].get("taluk", {}).get("value"),
            district=extraction_result["fields"].get("district", {}).get("value"),
            state=extraction_result["fields"].get("state", {}).get("value"),
            pincode=extraction_result["fields"].get("pincode", {}).get("value"),
            land_area=extraction_result["fields"].get("land_area", {}).get("value"),
            land_classification=extraction_result["fields"].get("land_classification", {}).get("value"),
            extracted_data=extraction_result["fields"],
            confidence_data=extraction_result["summary"],
            is_confirmed=False
        )
        db.add(extracted_record)
    else:
        extracted_record.document_type = extraction_result["document_type"]
        extracted_record.document_title = extraction_result["document_title"]
        extracted_record.document_number = extraction_result["fields"].get("registration_number", {}).get("value")
        extracted_record.document_date = extraction_result["fields"].get("document_date", {}).get("value")
        extracted_record.owner_name = extraction_result["fields"].get("owner_name", {}).get("value")
        extracted_record.parent_guardian_name = extraction_result["fields"].get("parent_guardian_name", {}).get("value")
        extracted_record.survey_number = extraction_result["fields"].get("survey_number", {}).get("value")
        extracted_record.subdivision_number = extraction_result["fields"].get("subdivision_number", {}).get("value")
        extracted_record.patta_number = extraction_result["fields"].get("patta_number", {}).get("value")
        extracted_record.plot_number = extraction_result["fields"].get("plot_number", {}).get("value")
        extracted_record.khata_number = extraction_result["fields"].get("khata_number", {}).get("value")
        extracted_record.khasra_number = extraction_result["fields"].get("khasra_number", {}).get("value")
        extracted_record.door_number = extraction_result["fields"].get("door_number", {}).get("value")
        extracted_record.street_name = extraction_result["fields"].get("street_name", {}).get("value")
        extracted_record.address = extraction_result["fields"].get("address", {}).get("value")
        extracted_record.village = extraction_result["fields"].get("village", {}).get("value")
        extracted_record.taluk = extraction_result["fields"].get("taluk", {}).get("value")
        extracted_record.district = extraction_result["fields"].get("district", {}).get("value")
        extracted_record.state = extraction_result["fields"].get("state", {}).get("value")
        extracted_record.pincode = extraction_result["fields"].get("pincode", {}).get("value")
        extracted_record.land_area = extraction_result["fields"].get("land_area", {}).get("value")
        extracted_record.land_classification = extraction_result["fields"].get("land_classification", {}).get("value")
        extracted_record.extracted_data = extraction_result["fields"]
        extracted_record.confidence_data = extraction_result["summary"]

    # Audit log
    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        action="DOCUMENT_DETAILS_EXTRACTED",
        entity_type="DOCUMENT",
        entity_id=str(doc.id),
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role,
        ip_address=client_ip,
        details={"detected_fields": extraction_result["summary"]["detected_fields_count"], "quality_grade": extraction_result["summary"]["quality_grade"]}
    )

    db.commit()
    db.refresh(extracted_record)

    return {
        "success": True,
        "document_id": doc.id,
        "document_number": doc.document_number,
        "document_title": extraction_result["document_title"],
        "document_type": extraction_result["document_type"],
        "document_type_confidence": extraction_result["document_type_confidence"],
        "is_confirmed": extracted_record.is_confirmed,
        "user_confirmed_data": extracted_record.user_confirmed_data,
        "fields": extraction_result["fields"],
        "summary": extraction_result["summary"],
        "disclaimer": extraction_result["disclaimer"]
    }

@router.get("/{document_id}/extracted-details")
def get_document_extracted_details(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetches existing structured details extracted from document OCR text.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to access this document's details")

    extracted_record = db.query(DocumentExtractedDetails).filter(DocumentExtractedDetails.document_id == doc.id).first()
    if not extracted_record:
        # Auto-extract if record doesn't exist yet
        ocr_record = db.query(OCRResult).filter(OCRResult.document_id == doc.id).first()
        raw_text = ocr_record.raw_text if ocr_record and ocr_record.raw_text else f"Document Title: {doc.title}\nDocument Number: {doc.document_number}"
        res = document_details_service.extract_structured_details(raw_text, doc.document_type)
        return {
            "success": True,
            "document_id": doc.id,
            "document_number": doc.document_number,
            "document_title": res["document_title"],
            "document_type": res["document_type"],
            "document_type_confidence": res["document_type_confidence"],
            "is_confirmed": False,
            "user_confirmed_data": None,
            "fields": res["fields"],
            "summary": res["summary"],
            "disclaimer": res["disclaimer"]
        }

    return {
        "success": True,
        "document_id": doc.id,
        "document_number": doc.document_number,
        "document_title": extracted_record.document_title or doc.title,
        "document_type": extracted_record.document_type or doc.document_type,
        "is_confirmed": extracted_record.is_confirmed,
        "confirmed_at": extracted_record.confirmed_at.isoformat() if extracted_record.confirmed_at else None,
        "user_confirmed_data": extracted_record.user_confirmed_data,
        "fields": extracted_record.extracted_data,
        "summary": extracted_record.confidence_data,
        "disclaimer": "Extracted information is generated from OCR analysis and should be reviewed before use."
    }

@router.put("/{document_id}/details")
def save_confirmed_document_details(
    document_id: int,
    payload: DocumentDetailsUpdateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Saves user-reviewed and corrected document details.
    Synchronizes updated fields with associated LandRecord and ExtractedField entities.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "GOVERNMENT_OFFICER" and current_user.role != "ADMIN" and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied to edit this document's details")

    confirmed_fields = payload.details
    
    extracted_record = db.query(DocumentExtractedDetails).filter(DocumentExtractedDetails.document_id == doc.id).first()
    if not extracted_record:
        extracted_record = DocumentExtractedDetails(document_id=doc.id, extracted_data={}, confidence_data={})
        db.add(extracted_record)

    extracted_record.user_confirmed_data = confirmed_fields
    extracted_record.is_confirmed = True
    extracted_record.confirmed_by = current_user.id
    extracted_record.confirmed_at = datetime.now(timezone.utc)

    # Sync specific key fields back to extracted_record columns
    if "owner_name" in confirmed_fields:
        extracted_record.owner_name = confirmed_fields["owner_name"]
    if "survey_number" in confirmed_fields:
        extracted_record.survey_number = confirmed_fields["survey_number"]
    if "patta_number" in confirmed_fields:
        extracted_record.patta_number = confirmed_fields["patta_number"]
    if "village" in confirmed_fields:
        extracted_record.village = confirmed_fields["village"]
    if "taluk" in confirmed_fields:
        extracted_record.taluk = confirmed_fields["taluk"]
    if "district" in confirmed_fields:
        extracted_record.district = confirmed_fields["district"]
    if "land_area" in confirmed_fields:
        extracted_record.land_area = confirmed_fields["land_area"]

    # Synchronize to associated LandRecord if exists
    land_rec = db.query(LandRecord).filter(LandRecord.document_id == doc.id).first()
    if land_rec:
        if "owner_name" in confirmed_fields and confirmed_fields["owner_name"] != "Not Detected":
            land_rec.owner_name = confirmed_fields["owner_name"]
        if "survey_number" in confirmed_fields and confirmed_fields["survey_number"] != "Not Detected":
            land_rec.survey_number = confirmed_fields["survey_number"]
        if "patta_number" in confirmed_fields and confirmed_fields["patta_number"] != "Not Detected":
            land_rec.patta_number = confirmed_fields["patta_number"]
        if "village" in confirmed_fields and confirmed_fields["village"] != "Not Detected":
            land_rec.village = confirmed_fields["village"]
        if "taluk" in confirmed_fields and confirmed_fields["taluk"] != "Not Detected":
            land_rec.taluk = confirmed_fields["taluk"]
        if "district" in confirmed_fields and confirmed_fields["district"] != "Not Detected":
            land_rec.district = confirmed_fields["district"]

    # Synchronize to ExtractedField table
    for f_name, f_val in confirmed_fields.items():
        ef = db.query(ExtractedField).filter(ExtractedField.document_id == doc.id, ExtractedField.field_name == f_name).first()
        if ef:
            ef.field_value = str(f_val)
            ef.is_modified_by_officer = (current_user.role == "GOVERNMENT_OFFICER")
            ef.officer_modified_value = str(f_val) if current_user.role == "GOVERNMENT_OFFICER" else None

    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        action="DOCUMENT_DETAILS_CONFIRMED",
        entity_type="DOCUMENT",
        entity_id=str(doc.id),
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role,
        ip_address=client_ip,
        details={"confirmed_fields_count": len(confirmed_fields)}
    )

    db.commit()
    return {
        "success": True,
        "message": "Document details confirmed and saved successfully.",
        "document_id": doc.id,
        "is_confirmed": True,
        "confirmed_details": confirmed_fields
    }

