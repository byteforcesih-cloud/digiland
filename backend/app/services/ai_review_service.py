from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.document import Document, DocumentVersion, ExtractedField, OCRResult
from app.models.document_details import DocumentExtractedDetails
from app.models.verification import ValidationResult, DuplicateRecord
from app.models.fraud_risk import FraudAnalysisResult, DocumentRiskScore
from app.services.validation_service import ValidationService
from app.services.duplicate_service import DuplicateService
from app.services.fraud_detection_service import fraud_detection_service
from app.services.document_details_service import document_details_service

class AIReviewService:
    """
    Unified AI Document Review & Verification Intelligence Engine.
    Aggregates multi-model findings for mandatory Verification Queue and on-demand Document Details inspection:
    - Document Classification & Category
    - Extracted 17-field Land Administration Schedule
    - Automated Rule Validation & Inconsistency Checks
    - Duplicate Conflict & Boundary Overlap Indicators
    - Digital Image Forensics & Tamper Risk Scoring
    - Actionable Officer Review Recommendations
    """

    MANDATORY_FIELDS = ["survey_number", "owner_name", "village", "district"]

    @classmethod
    def get_or_generate_ai_review(
        cls,
        db: Session,
        document_id: int,
        force_regenerate: bool = False
    ) -> Dict[str, Any]:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise ValueError(f"Document #{document_id} not found")

        # 1. Extracted Fields & OCR
        fields = db.query(ExtractedField).filter(ExtractedField.document_id == doc.id).all()
        ocr_record = db.query(OCRResult).filter(OCRResult.document_id == doc.id).first()
        
        field_dict = {f.field_name: f.field_value for f in fields}
        field_confidences = {f.field_name: f.confidence_score for f in fields}

        # 2. Automated Validation Analysis
        validation_model = db.query(ValidationResult).filter(ValidationResult.document_id == doc.id).first()
        if validation_model and not force_regenerate:
            val_errors = validation_model.error_count
            val_warnings = validation_model.warning_count
            val_passed = validation_model.validation_rules_passed
            val_total = validation_model.validation_rules_total
            val_mismatches = validation_model.mismatch_details or []
        else:
            val_dict = ValidationService.validate_document_fields(db, doc.id, fields)
            val_errors = val_dict.get("error_count", 0)
            val_warnings = val_dict.get("warning_count", 0)
            val_passed = val_dict.get("validation_rules_passed", 7)
            val_total = val_dict.get("validation_rules_total", 7)
            val_mismatches = val_dict.get("mismatch_details", [])

        # 3. Duplicate Analysis
        duplicate = db.query(DuplicateRecord).filter(
            (DuplicateRecord.document_id == doc.id) | (DuplicateRecord.matched_document_id == doc.id)
        ).first()
        if not duplicate and fields:
            duplicate = DuplicateService.check_for_duplicates(db, doc.id, fields)

        # 4. Tampering & Fraud Risk Scoring
        fraud_rec = db.query(FraudAnalysisResult).filter(FraudAnalysisResult.document_id == doc.id).first()
        if not fraud_rec or force_regenerate:
            fraud_data = fraud_detection_service.analyze_document_fraud(db, doc)
            risk_score = fraud_data.get("overall_risk_score", 15)
            risk_level = fraud_data.get("risk_level", "LOW")
            tamper_score = fraud_data.get("image_tamper_score", 10)
            metadata_anomaly = fraud_data.get("metadata_inconsistency_score", 5)
            anomaly_flags = fraud_data.get("anomaly_flags", [])
        else:
            risk_score = fraud_rec.overall_risk_score
            risk_level = fraud_rec.risk_level
            tamper_score = fraud_rec.image_tamper_score
            metadata_anomaly = fraud_rec.metadata_inconsistency_score
            anomaly_flags = fraud_rec.anomaly_flags or []

        # 5. Missing Fields Check
        missing_fields = [f for f in cls.MANDATORY_FIELDS if not field_dict.get(f)]

        # 6. Overall Confidence Calculation
        avg_ocr_conf = sum(field_confidences.values()) / max(len(field_confidences), 1) if field_confidences else 85.0
        val_penalty = min(val_errors * 15 + val_warnings * 5, 40)
        risk_penalty = (risk_score * 0.3)
        dup_penalty = 20 if (duplicate and duplicate.similarity_score > 75) else 0

        overall_ai_score = max(5.0, min(99.0, round(avg_ocr_conf - val_penalty - risk_penalty - dup_penalty, 1)))

        if overall_ai_score >= 85:
            quality_grade = "A (High Confidence)"
        elif overall_ai_score >= 70:
            quality_grade = "B (Good / Minor Review)"
        elif overall_ai_score >= 50:
            quality_grade = "C (Requires Officer Inspection)"
        else:
            quality_grade = "D (High Risk / Verification Required)"

        # 7. Actionable Recommendations Generation
        recommendations = []
        if duplicate and duplicate.similarity_score >= 75:
            recommendations.append(f"⚠️ High Duplicate Similarity ({duplicate.similarity_score}%) with Document #{duplicate.matched_document_id}. Review parcel ownership history.")
        if risk_level in ("HIGH", "CRITICAL"):
            recommendations.append(f"🚨 Elevated Fraud Risk detected ({risk_score}/100). Check image forensics and official stamp metadata.")
        if missing_fields:
            recommendations.append(f"📝 Missing mandatory schedule fields: {', '.join([m.replace('_', ' ').title() for m in missing_fields])}.")
        if val_errors > 0:
            recommendations.append(f"🔍 {val_errors} rule validation discrepancies flagged in schedule parsing.")
        if not recommendations:
            recommendations.append("✅ Document structure, OCR consistency, and land parcel boundaries pass standard revenue checks. Recommended for approval.")

        return {
            "document_id": doc.id,
            "document_number": doc.document_number,
            "title": doc.title,
            "document_type": doc.document_type,
            "version": doc.current_version,
            "status": doc.status,
            "review_timestamp": datetime.now(timezone.utc).isoformat(),
            "summary": {
                "overall_ai_score": overall_ai_score,
                "quality_grade": quality_grade,
                "ocr_confidence": round(avg_ocr_conf, 1),
                "risk_score": risk_score,
                "risk_level": risk_level,
                "tamper_score": tamper_score,
                "is_duplicate_flagged": duplicate is not None and duplicate.similarity_score >= 75,
                "duplicate_similarity": duplicate.similarity_score if duplicate else 0.0,
                "matched_document_id": duplicate.matched_document_id if duplicate else None,
                "validation_passed_count": val_passed,
                "validation_total_count": val_total,
                "validation_errors": val_errors,
                "validation_warnings": val_warnings
            },
            "extracted_schedule": [
                {
                    "field_name": f.field_name,
                    "field_label": f.field_label,
                    "field_value": f.field_value,
                    "confidence": f.confidence_score,
                    "requires_human_verification": f.requires_human_verification,
                    "is_modified": f.is_modified_by_officer,
                    "modified_value": f.officer_modified_value
                }
                for f in fields
            ],
            "inconsistencies": val_mismatches,
            "anomaly_flags": anomaly_flags,
            "missing_fields": missing_fields,
            "recommendations": recommendations,
            "disclaimer": "AI Review is generated by automated OCR, spatial heuristics, and integrity algorithms to assist human officers. Final legal authority remains with the designated Tahsildar / Revenue Officer."
        }

ai_review_service = AIReviewService()
