from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class LandRecord(Base):
    __tablename__ = "land_records"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Land Identification
    survey_number = Column(String(100), nullable=False, index=True)
    subdivision_number = Column(String(50), nullable=True)
    patta_number = Column(String(100), nullable=True, index=True)
    khasra_number = Column(String(100), nullable=True)
    khata_number = Column(String(100), nullable=True)
    plot_number = Column(String(100), nullable=True)
    land_parcel_id = Column(String(100), nullable=True, index=True)
    
    # Owner Information
    owner_name = Column(String(200), nullable=False, index=True)
    parent_guardian_name = Column(String(200), nullable=True)
    ownership_type = Column(String(100), default="Single Owner (Ryotwari Patta)")
    ownership_share = Column(String(50), default="100% Full Ownership")
    contact_phone = Column(String(20), nullable=True)
    
    # Land Details & Classifications
    land_classification = Column(String(100), default="Ryotwari Wet Land (Nanja)")
    land_category = Column(String(100), default="Residential") # Agricultural, Residential, Commercial
    land_area = Column(Float, nullable=False)
    area_unit = Column(String(30), default="Sq.Ft")
    land_dimensions = Column(String(200), nullable=True)
    
    # Boundaries (Synthetic references)
    north_boundary = Column(String(200), nullable=True)
    south_boundary = Column(String(200), nullable=True)
    east_boundary = Column(String(200), nullable=True)
    west_boundary = Column(String(200), nullable=True)
    
    # Location Hierarchy
    door_number = Column(String(50), nullable=True)
    building_name = Column(String(150), nullable=True)
    street_name = Column(String(200), nullable=True)
    area_locality = Column(String(150), nullable=True)
    village = Column(String(150), nullable=False, index=True)
    taluk = Column(String(150), nullable=False, index=True)
    district = Column(String(150), nullable=False, index=True)
    state = Column(String(150), default="Tamil Nadu")
    pincode = Column(String(20), nullable=True)
    
    # Registration Info
    registration_date = Column(Date, nullable=True)
    registration_office = Column(String(200), nullable=True)
    registration_officer = Column(String(150), nullable=True)
    previous_owner = Column(String(200), nullable=True)
    status = Column(String(50), default="PENDING_VERIFICATION")
    
    # Safe Synthetic Demo Marker
    is_synthetic_demo = Column(Boolean, default=True)
    demo_watermark = Column(String(200), default="SYNTHETIC DEMO RECORD — NOT A GOVERNMENT DOCUMENT")
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="land_records")
    document = relationship("Document", back_populates="land_record")
    gis_data = relationship("GISData", back_populates="land_record", uselist=False, cascade="all, delete-orphan")

class GISData(Base):
    __tablename__ = "gis_data"
    
    id = Column(Integer, primary_key=True, index=True)
    land_record_id = Column(Integer, ForeignKey("land_records.id", ondelete="CASCADE"), nullable=True)
    parcel_id = Column(String(100), nullable=True)
    survey_number = Column(String(100), nullable=False, index=True)
    subdivision_number = Column(String(50), nullable=True)
    patta_number = Column(String(100), nullable=True)
    street_name = Column(String(200), nullable=True)
    village = Column(String(150), nullable=False, index=True)
    taluk = Column(String(150), nullable=False, index=True)
    district = Column(String(150), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    boundary_polygon_geojson = Column(JSON, nullable=False) # GeoJSON geometry
    area_sqft = Column(Float, nullable=False)
    zone_type = Column(String(100), default="Residential")
    nearby_roads = Column(String(300), nullable=True)
    is_synthetic_demo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    land_record = relationship("LandRecord", back_populates="gis_data")
