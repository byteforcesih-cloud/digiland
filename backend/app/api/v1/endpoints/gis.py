from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.user import User
from app.models.land import GISData, LandRecord
from app.schemas.land import GISDataOut, LandRecordOut
from app.services.gis_service import GISService
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/parcels", response_model=List[GISDataOut])
def get_gis_parcels(
    district: Optional[str] = None,
    taluk: Optional[str] = None,
    village: Optional[str] = None,
    survey_number: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve spatial GeoJSON boundary parcels for GIS map rendering."""
    return GISService.get_parcels_in_bounds(db, district, taluk, village, survey_number)

@router.get("/search", response_model=List[LandRecordOut])
def search_land_records(
    q: Optional[str] = Query(None, description="General search keyword"),
    owner_name: Optional[str] = None,
    survey_number: Optional[str] = None,
    patta_number: Optional[str] = None,
    khasra_number: Optional[str] = None,
    khata_number: Optional[str] = None,
    village: Optional[str] = None,
    taluk: Optional[str] = None,
    district: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Multi-parameter Land Records Search across:
    - Owner Name
    - Survey Number
    - Patta Number
    - Khasra Number
    - Khata Number
    - Village / Taluk / District
    """
    query = db.query(LandRecord)

    if q:
        kw = f"%{q}%"
        query = query.filter(
            or_(
                LandRecord.owner_name.ilike(kw),
                LandRecord.survey_number.ilike(kw),
                LandRecord.patta_number.ilike(kw),
                LandRecord.khasra_number.ilike(kw),
                LandRecord.khata_number.ilike(kw),
                LandRecord.village.ilike(kw),
                LandRecord.district.ilike(kw)
            )
        )

    if owner_name:
        query = query.filter(LandRecord.owner_name.ilike(f"%{owner_name}%"))
    if survey_number:
        query = query.filter(LandRecord.survey_number.ilike(f"%{survey_number}%"))
    if patta_number:
        query = query.filter(LandRecord.patta_number.ilike(f"%{patta_number}%"))
    if khasra_number:
        query = query.filter(LandRecord.khasra_number.ilike(f"%{khasra_number}%"))
    if khata_number:
        query = query.filter(LandRecord.khata_number.ilike(f"%{khata_number}%"))
    if village:
        query = query.filter(LandRecord.village.ilike(f"%{village}%"))
    if taluk:
        query = query.filter(LandRecord.taluk.ilike(f"%{taluk}%"))
    if district:
        query = query.filter(LandRecord.district.ilike(f"%{district}%"))

    return query.order_by(LandRecord.id.desc()).all()
