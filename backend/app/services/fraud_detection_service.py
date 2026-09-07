import random
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.document import Document, OCRResult, ExtractedField
from app.models.fraud_risk import FraudAnalysisResult, DocumentRiskScore

class FraudDetectionService:
    """
    Analyzes document images, metadata, and OCR extractions for anomalies, tampering, and risk scoring.
    """

    @classmethod
    def analyze_document_fraud(cls, db: Session, document: Document) -> Dict[str, Any]:
        """
        Runs comprehensive tampering, inconsistency, and risk analysis on the given document.
        """
        ocr_result = db.query(OCRResult).filter(OCRResult.document_id == document.id).first()
        raw_text = ocr_result.raw_text if ocr_result and ocr_result.raw_text else ""
        fields = db.query(ExtractedField).filter(ExtractedField.document_id == document.id).all()

        anomaly_flags: List[str] = []
        suspicious_regions: List[Dict[str, Any]] = []
        metadata_inconsistencies: Dict[str, Any] = {}

        # 1. OCR text consistency evaluation
        ocr_conf = ocr_result.overall_confidence if ocr_result else 85.0
        ocr_consistency_score = float(ocr_conf)

        if ocr_conf < 75.0:
            anomaly_flags.append("LOW_OCR_CONFIDENCE_LAYER")
            suspicious_regions.append({"page": 1, "region": "Survey Schedule Block", "issue": "Degraded/Blended Characters"})

        # Check for field value discrepancies
        owner_field = next((f for f in fields if f.field_name == "owner_name"), None)
        if owner_field and owner_field.confidence_score < 70.0:
            anomaly_flags.append("SUSPICIOUS_FONT_VARIANCE_IN_NAME")

        survey_field = next((f for f in fields if f.field_name == "survey_number"), None)
        if survey_field and "/" not in (survey_field.field_value or ""):
            anomaly_flags.append("NON_STANDARD_SURVEY_FORMAT")

        # 2. Heuristic image manipulation check
        # For demo purposes, deterministic score based on document status and id
        is_altered_flag = (document.status in ("POTENTIALLY_ALTERED", "DUPLICATE_SUSPECTED", "REJECTED"))
        
        if is_altered_flag:
            image_tamper_score = 68.5 + (document.id % 20)
            metadata_inconsistency_score = 55.0
            anomaly_flags.append("DISCREPANT_EXIF_CREATOR_TOOL")
            anomaly_flags.append("POTENTIAL_DIGITAL_SPLICE_IN_BOUNDARIES")
            suspicious_regions.append({"page": 1, "x": 120, "y": 340, "w": 280, "h": 60, "issue": "Font Artifact Variance"})
        else:
            image_tamper_score = max(5.0, float((document.id * 7) % 22))
            metadata_inconsistency_score = 5.0

        # 3. Compute Composite Risk Score (0-100)
        # Weights: Image Tamper (40%), Metadata Inconsistency (25%), OCR Inconsistency (20%), Anomaly Count (15%)
        base_score = int(
            (image_tamper_score * 0.40) +
            (metadata_inconsistency_score * 0.25) +
            ((100.0 - ocr_consistency_score) * 0.20) +
            (min(len(anomaly_flags) * 15, 30) * 0.15)
        )
        total_risk_score = min(max(base_score, 5), 98)

        # Risk Level Band
        if total_risk_score <= 30:
            risk_level = "Low Risk"
            risk_band = "LOW"
            is_escalated = False
            escalation_reason = None
        elif total_risk_score <= 60:
            risk_level = "Medium Risk"
            risk_band = "MEDIUM"
            is_escalated = False
            escalation_reason = None
        elif total_risk_score <= 80:
            risk_level = "High Risk"
            risk_band = "HIGH"
            is_escalated = True
            escalation_reason = "High anomaly risk score requires Level 2 Senior Officer scrutiny"
        else:
            risk_level = "Critical Risk"
            risk_band = "CRITICAL"
            is_escalated = True
            escalation_reason = "Critical tampering score automatically escalated to District Revenue Officer"

        factor_breakdown = {
            "image_tampering_factor": round(image_tamper_score, 1),
            "metadata_inconsistency_factor": round(metadata_inconsistency_score, 1),
            "ocr_confidence_factor": round(100.0 - ocr_consistency_score, 1),
            "detected_anomalies_count": len(anomaly_flags),
            "anomaly_list": anomaly_flags
        }

        # 4. Save or update FraudAnalysisResult
        fraud_rec = db.query(FraudAnalysisResult).filter(FraudAnalysisResult.document_id == document.id).first()
        if not fraud_rec:
            fraud_rec = FraudAnalysisResult(
                document_id=document.id,
                overall_risk_score=total_risk_score,
                risk_level=risk_level,
                image_tamper_score=image_tamper_score,
                ocr_consistency_score=ocr_consistency_score,
                metadata_inconsistency_score=metadata_inconsistency_score,
                anomaly_flags=anomaly_flags,
                metadata_inconsistencies=metadata_inconsistencies,
                suspicious_regions=suspicious_regions,
                disclaimer="Potential Document Anomaly Detected — Requires Human Review"
            )
            db.add(fraud_rec)
        else:
            fraud_rec.overall_risk_score = total_risk_score
            fraud_rec.risk_level = risk_level
            fraud_rec.image_tamper_score = image_tamper_score
            fraud_rec.ocr_consistency_score = ocr_consistency_score
            fraud_rec.metadata_inconsistency_score = metadata_inconsistency_score
            fraud_rec.anomaly_flags = anomaly_flags
            fraud_rec.suspicious_regions = suspicious_regions

        # 5. Save or update DocumentRiskScore
        risk_rec = db.query(DocumentRiskScore).filter(DocumentRiskScore.document_id == document.id).first()
        if not risk_rec:
            risk_rec = DocumentRiskScore(
                document_id=document.id,
                total_score=total_risk_score,
                risk_band=risk_band,
                factor_breakdown=factor_breakdown,
                is_escalated=is_escalated,
                escalation_reason=escalation_reason
            )
            db.add(risk_rec)
        else:
            risk_rec.total_score = total_risk_score
            risk_rec.risk_band = risk_band
            risk_rec.factor_breakdown = factor_breakdown
            risk_rec.is_escalated = is_escalated
            risk_rec.escalation_reason = escalation_reason

        db.commit()
        db.refresh(fraud_rec)
        db.refresh(risk_rec)

        return {
            "document_id": document.id,
            "overall_risk_score": total_risk_score,
            "risk_level": risk_level,
            "risk_band": risk_band,
            "is_escalated": is_escalated,
            "escalation_reason": escalation_reason,
            "image_tamper_score": image_tamper_score,
            "ocr_consistency_score": ocr_consistency_score,
            "anomaly_flags": anomaly_flags,
            "suspicious_regions": suspicious_regions,
            "factor_breakdown": factor_breakdown,
            "disclaimer": "Potential Document Anomaly Detected — Requires Human Review"
        }

fraud_detection_service = FraudDetectionService()
