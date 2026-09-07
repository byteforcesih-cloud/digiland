from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.land_search_service import land_search_service

router = APIRouter()

@router.get("/states")
def get_available_states():
    """Returns list of configured Indian states."""
    return land_search_service.get_states()

@router.get("/districts")
def get_districts_by_state(state: str = Query("Tamil Nadu", description="Selected State")):
    """Returns administrative districts for selected state."""
    return land_search_service.get_districts(state)

@router.get("/taluks")
def get_taluks_by_district(
    district: str = Query(..., description="Selected District"),
    state: str = Query("Tamil Nadu", description="Selected State")
):
    """Returns revenue taluks for selected district."""
    return land_search_service.get_taluks(district, state)

@router.get("/villages")
def get_villages_by_taluk(
    taluk: str = Query(..., description="Selected Taluk"),
    district: str = Query(..., description="Selected District"),
    state: str = Query("Tamil Nadu", description="Selected State")
):
    """Returns revenue villages / localities for selected taluk."""
    return land_search_service.get_villages(taluk, district, state)

@router.get("/suggestions")
def get_search_suggestions(
    q: str = Query(..., min_length=1, description="Search query term"),
    field: Optional[str] = Query(None, description="Optional target field (e.g. survey_number, owner_name)"),
    db: Session = Depends(get_db)
):
    """
    Returns fast autocomplete suggestions for land search bars.
    """
    return land_search_service.get_autocomplete_suggestions(db, query=q, field=field)
