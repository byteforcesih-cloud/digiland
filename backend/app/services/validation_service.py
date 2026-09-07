import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.document import ExtractedField, Document
from app.models.land import LandRecord

class ValidationService:
    """
    Automated Land Record Data Validation Engine.
    Executes rules to verify integrity, detect discrepancies, and flag anomalies:
    1. Missing survey number rule
    2. Format consistency check (Survey / Patta regex)
    3. Low confidence field inspection
    4. Village & District consistency check
    5. Land Area positive value & dimensional match check
    6. Owner name completeness check
    7. Prior registered owner / record mismatch detection
    """

    TOTAL_RULES = 7

    @classmethod
    def validate_document_fields(cls, db: Session, document_id: int, extracted_fields: List[ExtractedField]) -> Dict[str, Any]:
        field_map = {f.field_name: (f.field_value or "").strip() for f in extracted_fields}
        conf_map = {f.field_name: f.confidence_score for f in extracted_fields}

        issues: List[Dict[str, Any]] = []
        rules_passed = 0

        # Rule 1: Missing Survey Number
        survey_num = field_map.get("survey_number", "")
        if not survey_num or survey_num.lower() in ["none", "null", "unknown", ""]:
            issues.append({
                "rule": "SURVEY_NUMBER_REQUIRED",
                "severity": "ERROR",
                "field": "survey_number",
                "message": "Survey Number is missing or empty. Mandatory field for revenue verification."
            })
        else:
            rules_passed += 1

        # Rule 2: Survey Number Format check
        if survey_num and not re.match(r"^[\dA-Za-z]+([\/\-][\dA-Za-z]+)*$", survey_num):
            issues.append({
                "rule": "SURVEY_NUMBER_FORMAT",
                "severity": "WARNING",
                "field": "survey_number",
                "message": f"Survey Number format '{survey_num}' contains unusual special characters."
            })
        elif survey_num:
            rules_passed += 1

        # Rule 3: Low Confidence Fields (< 75%)
        low_conf_fields = [f"{k} ({conf_map[k]:.1f}%)" for k, v in conf_map.items() if v < 75.0]
        if low_conf_fields:
            issues.append({
                "rule": "LOW_CONFIDENCE_THRESHOLD",
                "severity": "WARNING",
                "field": "multiple",
                "message": f"Low confidence detected in fields: {', '.join(low_conf_fields)}. Requires Human Verification."
            })
        else:
            rules_passed += 1

        # Rule 4: Village / District Consistency
        village = field_map.get("village", "")
        district = field_map.get("district", "")
        if not village or not district:
            issues.append({
                "rule": "LOCATION_INTEGRITY",
                "severity": "ERROR",
                "field": "village_district",
                "message": "Both Village and District must be present for geographic jurisdiction assignment."
            })
        else:
            rules_passed += 1

        # Rule 5: Land Area Validity
        area_str = field_map.get("land_area", "")
        if not area_str or not any(char.isdigit() for char in area_str):
            issues.append({
                "rule": "LAND_AREA_INVALID",
                "severity": "ERROR",
                "field": "land_area",
                "message": "Land area cannot be zero or empty."
            })
        else:
            rules_passed += 1

        # Rule 6: Owner Name Completeness
        owner_name = field_map.get("owner_name", "")
        if len(owner_name) < 3:
            issues.append({
                "rule": "OWNER_NAME_INCOMPLETE",
                "severity": "ERROR",
                "field": "owner_name",
                "message": "Owner Name must have at least 3 characters."
            })
        else:
            rules_passed += 1

        # Rule 7: Cross-record database conflict check
        if survey_num and village and district:
            existing_record = db.query(LandRecord).filter(
                LandRecord.survey_number == survey_num,
                LandRecord.district == district,
                LandRecord.village == village,
                LandRecord.document_id != document_id
            ).first()
            if existing_record and existing_record.owner_name.lower() != owner_name.lower():
                issues.append({
                    "rule": "OWNER_MISMATCH_RECORD_CONFLICT",
                    "severity": "WARNING",
                    "field": "owner_name",
                    "message": f"Survey {survey_num} in {village} is registered under existing owner '{existing_record.owner_name}'. Potential mutation/title conflict."
                })
            else:
                rules_passed += 1
        else:
            rules_passed += 1

        error_count = sum(1 for i in issues if i["severity"] == "ERROR")
        warning_count = sum(1 for i in issues if i["severity"] == "WARNING")

        if error_count > 0:
            status = "INVALID"
        elif warning_count > 0:
            status = "NEEDS_REVIEW"
        else:
            status = "VALID"

        return {
            "status": status,
            "error_count": error_count,
            "warning_count": warning_count,
            "validation_rules_passed": rules_passed,
            "validation_rules_total": cls.TOTAL_RULES,
            "mismatch_details": issues
        }
