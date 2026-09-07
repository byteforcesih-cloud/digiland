from sqlalchemy import Column, Integer, String, Boolean, JSON
from app.db.base import Base

class FeatureAccessDefinition(Base):
    """
    Defines DigiLand features, required roles, and verification requirements for dynamic RBAC queries.
    """
    __tablename__ = "feature_access_definitions"

    id = Column(Integer, primary_key=True, index=True)
    feature_key = Column(String(100), unique=True, nullable=False, index=True)
    feature_name = Column(String(150), nullable=False)
    description = Column(String(255), nullable=True)
    category = Column(String(100), default="Land Management") # Identity & Verification, Document Operations, Land Registry & GIS, Dispute Management, Officer Tools, Security & Audit
    allowed_roles = Column(JSON, nullable=False, default=list) # ["CITIZEN", "GOVERNMENT_OFFICER", "ADMIN"]
    requires_aadhaar_verified = Column(Boolean, default=True)
    requires_officer_role = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
