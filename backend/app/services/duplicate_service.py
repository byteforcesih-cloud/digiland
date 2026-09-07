import difflib
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.document import Document, ExtractedField
from app.models.verification import DuplicateRecord

class DuplicateService:
    """
    Intelligent Duplicate Land Record & Conflict Detection Engine.
    Cross-compares key extracted identifiers against existing repository records:
    - Survey Number
    - Patta Number
    - Khasra Number
    - Owner Name
    - Village & District
    - Land Area
    - Document Number
    """

    MATCH_WEIGHTS = {
        "survey_number": 30.0,
        "village": 20.0,
        "district": 15.0,
        "patta_number": 15.0,
        "owner_name": 10.0,
        "land_area": 10.0
    }

    @classmethod
    def check_for_duplicates(cls, db: Session, document_id: int, extracted_fields: List[ExtractedField]) -> Optional[DuplicateRecord]:
        field_map = {f.field_name: (f.field_value or "").strip().lower() for f in extracted_fields}
        
        survey = field_map.get("survey_number", "")
        patta = field_map.get("patta_number", "")
        village = field_map.get("village", "")
        district = field_map.get("district", "")
        owner = field_map.get("owner_name", "")
        area = field_map.get("land_area", "")

        if not survey or not district:
            return None

        # Fetch other documents
        candidate_docs = db.query(Document).filter(Document.id != document_id).all()
        
        best_match_doc = None
        highest_score = 0.0
        matched_field_names: List[str] = []

        for other_doc in candidate_docs:
            other_fields = {f.field_name: (f.field_value or "").strip().lower() for f in other_doc.extracted_fields}
            if not other_fields:
                continue

            score = 0.0
            matched_curr: List[str] = []

            # 1. Survey Number Match
            if survey and other_fields.get("survey_number") == survey:
                score += cls.MATCH_WEIGHTS["survey_number"]
                matched_curr.append("survey_number")

            # 2. Village Match
            if village and other_fields.get("village") == village:
                score += cls.MATCH_WEIGHTS["village"]
                matched_curr.append("village")

            # 3. District Match
            if district and other_fields.get("district") == district:
                score += cls.MATCH_WEIGHTS["district"]
                matched_curr.append("district")

            # 4. Patta Number Match
            if patta and other_fields.get("patta_number") == patta:
                score += cls.MATCH_WEIGHTS["patta_number"]
                matched_curr.append("patta_number")

            # 5. Owner Fuzzy Match
            other_owner = other_fields.get("owner_name", "")
            if owner and other_owner:
                ratio = difflib.SequenceMatcher(None, owner, other_owner).ratio()
                if ratio > 0.8:
                    score += cls.MATCH_WEIGHTS["owner_name"] * ratio
                    matched_curr.append("owner_name")

            # 6. Land Area Match
            if area and other_fields.get("land_area") == area:
                score += cls.MATCH_WEIGHTS["land_area"]
                matched_curr.append("land_area")

            if score > highest_score:
                highest_score = score
                best_match_doc = other_doc
                matched_field_names = matched_curr

        # If similarity exceeds 75% threshold, flag duplicate
        if highest_score >= 75.0 and best_match_doc:
            # Check if duplicate entry already logged
            existing_dup = db.query(DuplicateRecord).filter(
                DuplicateRecord.document_id == document_id,
                DuplicateRecord.matched_document_id == best_match_doc.id
            ).first()
            if not existing_dup:
                dup_record = DuplicateRecord(
                    document_id=document_id,
                    matched_document_id=best_match_doc.id,
                    similarity_score=round(highest_score, 2),
                    matched_fields=matched_field_names,
                    status="DETECTED"
                )
                db.add(dup_record)
                db.commit()
                db.refresh(dup_record)
                return dup_record
            return existing_dup

        return None
