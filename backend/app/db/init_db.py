from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.models.user import Role
from app.services.seed_data import seed_demo_data

def init_db(db: Session) -> None:
    # 1. Create all tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed Roles
    if not db.query(Role).first():
        roles = [
            Role(name="CITIZEN", description="Citizen user for land record storage and verification requests"),
            Role(name="GOVERNMENT_OFFICER", description="Revenue and Land Administration Officer with verification rights"),
            Role(name="ADMIN", description="System and security administrator")
        ]
        db.add_all(roles)
        db.commit()

    # 3. Seed comprehensive synthetic datasets (50+ Aadhaar, 50+ Land Records, 6 Officers)
    seed_demo_data(db, force_reset=False)
