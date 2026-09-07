import re
from typing import Dict, Any, Optional, List, Tuple

class DocumentDetailsExtractionService:
    """
    Service responsible for extracting structured Indian land administration details
    from raw OCR text using a 4-level extraction strategy:
      1. Label-based regex & proximity matching
      2. Pattern recognition (Dates, Survey numbers, Area units, Pincodes)
      3. Document-type specific contextual heuristics
      4. Confidence scoring, categorization, and normalization
    """

    # Localized & standard field label aliases
    LABEL_PATTERNS = {
        "owner_name": [
            r"(?:Owner(?:\s+Name)?|Pattadhar(?:\s+Name)?|Landowner|Purchaser|Buyer|Executant|Name\s+of\s+Owner|Claimant|Registered\s+Owner)\s*[:=-]\s*([^\n\r,;]{3,80})",
            r"(?:Thiru|Tmt|Dr|Mr|Mrs|Shri|Smt)\.?\s+([A-Z][A-Za-z\s.]{3,60})(?:\s+S/o|\s+D/o|\s+W/o|\s+residing)"
        ],
        "parent_guardian_name": [
            r"(?:Father['’]?s\s+Name|Father/Guardian|S/o|D/o|W/o|Guardian\s+Name|Husband['’]?s\s+Name)\s*[:=-]?\s*([^\n\r,;]{3,60})",
            r"(?:son\s+of|daughter\s+of|wife\s+of)\s+([A-Z][A-Za-z\s.]{3,60})"
        ],
        "survey_number": [
            r"(?:Survey\s+(?:No|Number)|Sy\.?\s*No|Khasra\s+(?:No|Number)|Survey\s+&\s+Sub-Division|Gat\s+No|CTS\s+No)\s*[:=-]?\s*([0-9]{1,4}(?:\s*[/]\s*[0-9A-Za-z]+)?(?:\s*-\s*[A-Za-z0-9]+)?)",
            r"\b(?:Survey|Sy)\.?\s*#?\s*([0-9]{1,4}/[0-9A-Za-z]+)\b"
        ],
        "subdivision_number": [
            r"(?:Sub-Division|Subdivision|Sub\s+Div(?:\s+No)?|Sub-division\s+No)\s*[:=-]?\s*([A-Za-z0-9/]{1,15})",
            r"\b\d+[/]([A-Za-z0-9]+)\b"
        ],
        "patta_number": [
            r"(?:Patta\s+(?:No|Number)|Patta\s+Extract\s+No|Khata\s+(?:No|Number))\s*[:=-]?\s*([A-Za-z0-9/-]{2,25})",
            r"\bPATTA-?([0-9A-Z]+)\b"
        ],
        "plot_number": [
            r"(?:Plot\s+(?:No|Number)|Site\s+(?:No|Number)|Door/Plot\s+No)\s*[:=-]?\s*([A-Za-z0-9/-]{1,20})",
            r"\bPlot\s+#?\s*([0-9A-Za-z-]+)\b"
        ],
        "khasra_number": [
            r"(?:Khasra\s+(?:No|Number)|Khasra)\s*[:=-]?\s*([A-Za-z0-9/-]{1,20})",
            r"\bKH-?([0-9A-Z]+)\b"
        ],
        "khata_number": [
            r"(?:Khata\s+(?:No|Number)|Khata\s+Certificate\s+No)\s*[:=-]?\s*([A-Za-z0-9/-]{1,20})",
            r"\bKT-?([0-9A-Z]+)\b"
        ],
        "village": [
            r"(?:Village(?:\s+Name)?|Grama|Revenue\s+Village|Locality|Town)\s*[:=-]?\s*([^\n\r,;]{3,50})",
            r"(?:Village|Grama)\s+of\s+([A-Z][A-Za-z\s]{3,40})"
        ],
        "taluk": [
            r"(?:Taluk|Tehsil|Mandal|Sub-Division\s+Taluk)\s*[:=-]?\s*([^\n\r,;]{3,50})",
            r"([A-Z][A-Za-z\s]{3,40})\s+Taluk"
        ],
        "district": [
            r"(?:District|Dist\.?)\s*[:=-]?\s*([^\n\r,;]{3,50})",
            r"([A-Z][A-Za-z\s]{3,40})\s+District"
        ],
        "state": [
            r"(?:State)\s*[:=-]?\s*([^\n\r,;]{3,40})",
            r"\b(Tamil\s+Nadu|Karnataka|Maharashtra|Kerala|Telangana|Andhra\s+Pradesh|Uttar\s+Pradesh|Gujarat|Delhi)\b"
        ],
        "document_date": [
            r"(?:Date\s+of\s+Registration|Registration\s+Date|Executed\s+on|Date\s+of\s+Execution|Date\s+of\s+Issue|Date)\s*[:=-]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+[0-9]{4})",
            r"\b([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})\b"
        ],
        "registration_number": [
            r"(?:Document\s+(?:No|Number)|Doc\s+No|Registration\s+(?:No|Number)|Reg\s+No|Book\s+1\s+No|Entry\s+No)\s*[:=-]?\s*([A-Za-z0-9/-]{3,30})",
            r"\bDOC-[A-Z]{2,4}-[0-9]{4}-[0-9A-Z]+\b"
        ],
        "land_area": [
            r"(?:Land\s+Area|Total\s+Extent|Extent\s+of\s+Land|Total\s+Area|Area)\s*[:=-]?\s*([0-9,.]+\s*(?:Sq\.?\s*Ft|Acres?|Cents?|Hectares?|Gunthas?|Sq\.?\s*Mtrs?|Grounds?|Katha)?)",
            r"\b([0-9,.]+\s*(?:Sq\.?\s*Ft|Acres?|Cents?|Hectares?|Gunthas?))\b"
        ],
        "land_classification": [
            r"(?:Land\s+Classification|Classification|Type\s+of\s+Land|Land\s+Type|Category)\s*[:=-]?\s*([^\n\r,;]{3,60})",
            r"\b(Ryotwari\s+Wet\s+Land|Ryotwari\s+Dry\s+Land|Grama\s+Natham|Nanja|Punja|Residential\s+Plot|Commercial\s+Layout|Purayidam|Nilam)\b"
        ],
        "door_number": [
            r"(?:Door\s+(?:No|Number)|D\.?\s*No|House\s+(?:No|Number)|Flat\s+No|Premises\s+No)\s*[:=-]?\s*([A-Za-z0-9/#-]{1,20})"
        ],
        "street_name": [
            r"(?:Street(?:\s+Name)?|Road|Lane|Avenue|Salai|Nagar|Cross|Main\s+Road)\s*[:=-]?\s*([^\n\r,;]{3,60})"
        ],
        "pincode": [
            r"(?:Pincode|Pin\s+Code|PIN)\s*[:=-]?\s*([1-9][0-9]{5})",
            r"\b([1-9][0-9]{5})\b"
        ]
    }

    # Document type keywords
    DOC_TYPE_KEYWORDS = {
        "PATTA_CHITTA": ["patta", "chitta", "form 11", "pattadhar", "extract of patta", "tahsildar patta"],
        "SALE_DEED": ["sale deed", "deed of conveyance", "absolute sale", "vendor", "purchaser", "sub-registrar"],
        "ENCUMBRANCE_CERTIFICATE": ["encumbrance certificate", "ec form 15", "nil encumbrance", "search period", "inspector general of registration"],
        "MUTATION_RECORD": ["mutation", "jamabandi", "revenue mutation", "order of mutation", "fard"],
        "LAND_TAX_RECEIPT": ["tax receipt", "property tax", "land revenue receipt", "assessment tax", "kist receipt"],
        "PARTITION_DEED": ["partition deed", "deed of partition", "co-sharers", "schedule a", "schedule b"],
        "SETTLEMENT_DEED": ["settlement deed", "deed of settlement", "settlor", "settlee", "out of love and affection"],
        "SURVEY_SKETCH": ["fmb", "field measurement", "survey sketch", "cadastral map", "sub-division sketch"]
    }

    @classmethod
    def detect_document_type(cls, ocr_text: str, fallback: Optional[str] = None) -> Tuple[str, float]:
        """Detect document type from OCR content."""
        text_lower = ocr_text.lower()
        best_type = fallback or "PATTA_CHITTA"
        highest_score = 0.5

        for doc_type, keywords in cls.DOC_TYPE_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            if matches > 0:
                score = min(0.70 + (matches * 0.10), 0.98)
                if score > highest_score:
                    highest_score = score
                    best_type = doc_type

        return best_type, round(highest_score, 2)

    @classmethod
    def _clean_value(cls, val: str) -> str:
        """Sanitize extracted field value."""
        if not val:
            return ""
        val = val.strip().strip(":=-,;\"'")
        # Clean extra whitespace
        val = re.sub(r"\s+", " ", val)
        return val

    @classmethod
    def _evaluate_confidence_level(cls, score: float) -> str:
        """Return categorical confidence label."""
        if score >= 0.85:
            return "High Confidence"
        elif score >= 0.70:
            return "Medium Confidence"
        elif score > 0.0:
            return "Low Confidence"
        return "Not Detected"

    @classmethod
    def extract_structured_details(cls, ocr_text: str, document_type_hint: Optional[str] = None) -> Dict[str, Any]:
        """
        Main extraction entrypoint. Returns structured details, confidence values,
        and summary metrics.
        """
        if not ocr_text or not ocr_text.strip():
            return cls._generate_empty_result()

        # Step 1: Detect Document Type
        detected_doc_type, type_conf = cls.detect_document_type(ocr_text, document_type_hint)

        extracted_fields: Dict[str, Dict[str, Any]] = {}
        text = ocr_text.strip()

        # Step 2: Level 1 & 2 - Extract each field using label and pattern regexes
        for field_name, patterns in cls.LABEL_PATTERNS.items():
            extracted_val = None
            field_conf = 0.0

            for idx, pat in enumerate(patterns):
                match = re.search(pat, text, re.IGNORECASE | re.MULTILINE)
                if match:
                    raw_val = match.group(1) if match.groups() else match.group(0)
                    cleaned = cls._clean_value(raw_val)
                    if cleaned and len(cleaned) >= 2:
                        extracted_val = cleaned
                        # First pattern is usually strict label (higher confidence), second is pattern/fallback
                        field_conf = 0.94 if idx == 0 else 0.82
                        break

            # If not detected, mark clearly
            if not extracted_val or extracted_val.lower() in ("nil", "null", "none", "n/a"):
                extracted_fields[field_name] = {
                    "value": "Not Detected",
                    "confidence": 0.0,
                    "confidence_level": "Not Detected",
                    "is_detected": False
                }
            else:
                extracted_fields[field_name] = {
                    "value": extracted_val,
                    "confidence": round(field_conf, 2),
                    "confidence_level": cls._evaluate_confidence_level(field_conf),
                    "is_detected": True
                }

        # Step 3: Level 3 - Cross-Field Consistency and Normalization
        # Normalize Sub-Division if embedded in Survey Number (e.g. 142/3A -> Sub-div 3A)
        surv_val = extracted_fields["survey_number"]["value"]
        subdiv_val = extracted_fields["subdivision_number"]["value"]
        if surv_val != "Not Detected" and "/" in surv_val and subdiv_val == "Not Detected":
            parts = surv_val.split("/")
            if len(parts) > 1 and parts[1].strip():
                extracted_fields["subdivision_number"] = {
                    "value": parts[1].strip(),
                    "confidence": 0.90,
                    "confidence_level": "High Confidence",
                    "is_detected": True
                }

        # Normalize Full Address from components if address field was not explicitly extracted
        addr_val = extracted_fields.get("address", {}).get("value")
        if not addr_val or addr_val == "Not Detected":
            components = []
            if extracted_fields["door_number"]["is_detected"]:
                components.append(f"Door {extracted_fields['door_number']['value']}")
            if extracted_fields["street_name"]["is_detected"]:
                components.append(extracted_fields["street_name"]["value"])
            if extracted_fields["village"]["is_detected"]:
                components.append(extracted_fields["village"]["value"])
            if extracted_fields["taluk"]["is_detected"]:
                components.append(f"{extracted_fields['taluk']['value']} Taluk")
            if extracted_fields["district"]["is_detected"]:
                components.append(f"{extracted_fields['district']['value']} District")
            if extracted_fields["pincode"]["is_detected"]:
                components.append(f"PIN: {extracted_fields['pincode']['value']}")
            
            if components:
                compiled_addr = ", ".join(components)
                extracted_fields["address"] = {
                    "value": compiled_addr,
                    "confidence": 0.88,
                    "confidence_level": "High Confidence",
                    "is_detected": True
                }
            else:
                extracted_fields["address"] = {
                    "value": "Not Detected",
                    "confidence": 0.0,
                    "confidence_level": "Not Detected",
                    "is_detected": False
                }

        # Step 4: Calculate overall metrics
        detected_count = sum(1 for f in extracted_fields.values() if f["is_detected"])
        total_fields = len(extracted_fields)
        avg_confidence = (
            sum(f["confidence"] for f in extracted_fields.values() if f["is_detected"]) / max(detected_count, 1)
        )

        doc_title_human = cls._get_document_title_human(detected_doc_type)

        return {
            "success": True,
            "document_type": detected_doc_type,
            "document_title": doc_title_human,
            "document_type_confidence": type_conf,
            "fields": extracted_fields,
            "summary": {
                "total_fields": total_fields,
                "detected_fields_count": detected_count,
                "missing_fields_count": total_fields - detected_count,
                "average_confidence": round(avg_confidence, 2),
                "quality_grade": "High" if avg_confidence >= 0.85 else "Medium" if avg_confidence >= 0.70 else "Low"
            },
            "disclaimer": "Extracted information is generated from OCR analysis and should be reviewed before use."
        }

    @classmethod
    def _get_document_title_human(cls, doc_type: str) -> str:
        titles = {
            "PATTA_CHITTA": "Patta / Chitta Revenue Extract",
            "SALE_DEED": "Registered Sale Deed of Conveyance",
            "ENCUMBRANCE_CERTIFICATE": "Encumbrance Certificate (EC Form 15)",
            "MUTATION_RECORD": "Revenue Mutation & Jamabandi Record",
            "LAND_TAX_RECEIPT": "Land Revenue & Property Tax Receipt",
            "PARTITION_DEED": "Registered Deed of Partition",
            "SETTLEMENT_DEED": "Family Property Settlement Deed",
            "SURVEY_SKETCH": "Field Measurement Book (FMB) Sketch"
        }
        return titles.get(doc_type, "Digital Land Record")

    @classmethod
    def _generate_empty_result(cls) -> Dict[str, Any]:
        """Fallback for empty input."""
        empty_fields = {}
        for k in cls.LABEL_PATTERNS.keys():
            empty_fields[k] = {
                "value": "Not Detected",
                "confidence": 0.0,
                "confidence_level": "Not Detected",
                "is_detected": False
            }
        return {
            "success": False,
            "document_type": "UNKNOWN",
            "document_title": "Undetected Document",
            "document_type_confidence": 0.0,
            "fields": empty_fields,
            "summary": {
                "total_fields": len(empty_fields),
                "detected_fields_count": 0,
                "missing_fields_count": len(empty_fields),
                "average_confidence": 0.0,
                "quality_grade": "Low"
            },
            "disclaimer": "Extracted information is generated from OCR analysis and should be reviewed before use."
        }

document_details_service = DocumentDetailsExtractionService()
