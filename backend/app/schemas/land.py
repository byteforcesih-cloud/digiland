from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import date, datetime

class GISDataOut(BaseModel):
    id: int
    land_record_id: Optional[int] = None
    survey_number: str
    patta_number: Optional[str] = None
    village: str
    taluk: str
    district: str
    latitude: float
    longitude: float
    boundary_polygon_geojson: Dict[str, Any]
    area_sqft: float
    zone_type: str
    created_at: datetime

    class Config:
        from_attributes = True

class LandRecordOut(BaseModel):
    id: int
    document_id: Optional[int] = None
    user_id: int
    owner_name: str
    survey_number: str
    patta_number: Optional[str] = None
    khasra_number: Optional[str] = None
    khata_number: Optional[str] = None
    plot_number: Optional[str] = None
    land_area: float
    area_unit: str
    land_dimensions: Optional[str] = None
    village: str
    taluk: str
    district: str
    state: str
    registration_date: Optional[date] = None
    registration_office: Optional[str] = None
    registration_officer: Optional[str] = None
    previous_owner: Optional[str] = None
    status: str
    created_at: datetime
    gis_data: Optional[GISDataOut] = None

    class Config:
        from_attributes = True

class LandSearchQuery(BaseModel):
    query: Optional[str] = None
    owner_name: Optional[str] = None
    survey_number: Optional[str] = None
    patta_number: Optional[str] = None
    khasra_number: Optional[str] = None
    khata_number: Optional[str] = None
    village: Optional[str] = None
    taluk: Optional[str] = None
    district: Optional[str] = None
    document_number: Optional[str] = None
