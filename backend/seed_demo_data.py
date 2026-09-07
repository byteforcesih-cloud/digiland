import sys
import os
import argparse

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models import *
from app.services.seed_data import seed_demo_data

def main():
    parser = argparse.ArgumentParser(description="DigiLand Safe Demo Database Reset & Seeder")
    parser.add_argument("--reset", action="store_true", help="Safely removes old demo records before seeding.")
    parser.add_argument("--force", action="store_true", help="Skip confirmation prompt in automated scripts.")
    args = parser.parse_args()

    print("\n" + "=" * 80)
    print("[DIGILAND] DEMO DATABASE SEED ENGINE")
    print("=" * 80)

    if args.reset and not args.force:
        confirm = input("Are you sure you want to reset all demo records? (y/N): ").strip().lower()
        if confirm != "y":
            print("Operation aborted.")
            return

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        results = seed_demo_data(db, force_reset=args.reset)
        print("\n" + "=" * 80)
        print("[SUCCESS] DEMO DATABASE SEED COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        print(f"  * Mock Aadhaar Profiles Created : {results.get('mock_aadhaar_created', 0)}")
        print(f"  * Citizen Accounts Created      : {results.get('citizen_users_created', 0)}")
        print(f"  * Officer Accounts Created      : {results.get('officer_users_created', 0)}")
        print(f"  * Land Records Created          : {results.get('land_records_created', 0)}")
        print(f"  * Documents & OCR Data Created  : {results.get('documents_created', 0)}")
        print(f"  * GIS Cadastral Parcels Created : {results.get('gis_parcels_created', 0)}")
        print(f"  * Dispute Cases Created         : {results.get('disputes_created', 0)}")
        print("\n[Status Breakdown]:")
        for status_name, count in results.get("status_breakdown", {}).items():
            print(f"    - {status_name:<24} : {count} records")
        print("=" * 80 + "\n")
    finally:
        db.close()

if __name__ == "__main__":
    main()
