from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.land import GISData, LandRecord

class GISService:
    """
    Replaceable GIS & Spatial Parcel Service.
    Generates standard GeoJSON geometries, calculates parcel coordinates,
    and supports spatial query lookups by Survey Number, Patta, and Jurisdiction.
    """

    @classmethod
    def generate_parcel_geometry(cls, latitude: float, longitude: float, area_sqft: float) -> Dict[str, Any]:
        """
        Creates a realistic quadrilateral polygon centered around the coordinate point.
        """
        # Approximate 1 degree latitude ~ 111,000 meters. 2400 sq.ft ~ 222 sq.m (approx 15m x 15m)
        delta_lat = 0.00015
        delta_lon = 0.00015

        p1 = [round(longitude - delta_lon, 6), round(latitude - delta_lat, 6)]
        p2 = [round(longitude + delta_lon, 6), round(latitude - delta_lat, 6)]
        p3 = [round(longitude + delta_lon, 6), round(latitude + delta_lat, 6)]
        p4 = [round(longitude - delta_lon, 6), round(latitude + delta_lat, 6)]
        
        return {
            "type": "Polygon",
            "coordinates": [[p1, p2, p3, p4, p1]]
        }

    @classmethod
    def get_parcels_in_bounds(
        cls, 
        db: Session, 
        district: Optional[str] = None, 
        taluk: Optional[str] = None, 
        village: Optional[str] = None,
        survey_number: Optional[str] = None
    ) -> List[GISData]:
        query = db.query(GISData)
        if district:
            query = query.filter(GISData.district.ilike(f"%{district}%"))
        if taluk:
            query = query.filter(GISData.taluk.ilike(f"%{taluk}%"))
        if village:
            query = query.filter(GISData.village.ilike(f"%{village}%"))
        if survey_number:
            query = query.filter(GISData.survey_number.ilike(f"%{survey_number}%"))
        return query.all()
