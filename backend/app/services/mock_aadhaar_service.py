import re
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.aadhaar import MockAadhaarProfile

# 50+ Completely Synthetic Demo Aadhaar Records (No real PII)
DEMO_SYNTHETIC_AADHAAR_PROFILES = [
    {
        "aadhaar_number": "1234-5678-9012",
        "full_name": "Kathir",
        "date_of_birth": "1995-05-10",
        "gender": "Male",
        "address": "No. 15, Gandhi Street, T. Nagar",
        "village": "T. Nagar",
        "taluk": "Mylapore",
        "district": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600017",
        "phone_number": "7894561230",
        "email": "kathir@gmail.com"
    },
    {
        "aadhaar_number": "2428-0522-6816",
        "full_name": "Tamilarasan D",
        "date_of_birth": "2000-03-24",
        "gender": "Male",
        "address": "No. 24, Anna Salai, Guindy",
        "village": "Guindy",
        "taluk": "Guindy",
        "district": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600032",
        "phone_number": "6382111385",
        "email": "tamilarasan.d@example.com"
    },
    {
        "aadhaar_number": "9901-2345-6789",
        "full_name": "Ramasamy Subramanian",
        "date_of_birth": "1988-05-14",
        "gender": "Male",
        "address": "No. 42, Mada Church Road, Mylapore",
        "village": "Mylapore",
        "taluk": "Mylapore",
        "district": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600004",
        "phone_number": "9840123456",
        "email": "ramasamy.s@example.com"
    },
    {
        "aadhaar_number": "9902-3456-7890",
        "full_name": "Meenakshi Sundaram",
        "date_of_birth": "1992-08-22",
        "gender": "Female",
        "address": "Plot 18, South Masi Street",
        "village": "Madurai South",
        "taluk": "Madurai South",
        "district": "Madurai",
        "state": "Tamil Nadu",
        "pincode": "625001",
        "phone_number": "9841234567",
        "email": "meenakshi.s@example.com"
    },
    {
        "aadhaar_number": "9903-4567-8901",
        "full_name": "Karthik Raja Annamalai",
        "date_of_birth": "1985-11-30",
        "gender": "Male",
        "address": "Flat 3B, RS Puram West",
        "village": "RS Puram",
        "taluk": "Coimbatore North",
        "district": "Coimbatore",
        "state": "Tamil Nadu",
        "pincode": "641002",
        "phone_number": "9842345678",
        "email": "karthik.raja@example.com"
    },
    {
        "aadhaar_number": "9904-5678-9012",
        "full_name": "Lakshmi Narayanan",
        "date_of_birth": "1979-03-17",
        "gender": "Female",
        "address": "Door 7, Gandhi Road",
        "village": "Hasthampatti",
        "taluk": "Salem West",
        "district": "Salem",
        "state": "Tamil Nadu",
        "pincode": "636007",
        "phone_number": "9843456789",
        "email": "lakshmi.n@example.com"
    },
    {
        "aadhaar_number": "9905-6789-0123",
        "full_name": "Venkatesh Raghavan",
        "date_of_birth": "1995-09-05",
        "gender": "Male",
        "address": "104, Thillai Nagar 5th Cross",
        "village": "Thillai Nagar",
        "taluk": "Tiruchirappalli West",
        "district": "Tiruchirappalli",
        "state": "Tamil Nadu",
        "pincode": "620018",
        "phone_number": "9844567890",
        "email": "venkatesh.r@example.com"
    },
    {
        "aadhaar_number": "9906-7890-1234",
        "full_name": "Ananya Sharma",
        "date_of_birth": "1990-12-10",
        "gender": "Female",
        "address": "Tower 4, Indiranagar 100ft Road",
        "village": "Indiranagar",
        "taluk": "Bengaluru East",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "pincode": "560038",
        "phone_number": "9880123456",
        "email": "ananya.sharma@example.com"
    },
    {
        "aadhaar_number": "9907-8901-2345",
        "full_name": "Suresh Reddy",
        "date_of_birth": "1983-07-19",
        "gender": "Male",
        "address": "B-22, Banjara Hills Road No 12",
        "village": "Banjara Hills",
        "taluk": "Shaikpet",
        "district": "Hyderabad",
        "state": "Telangana",
        "pincode": "500034",
        "phone_number": "9866123456",
        "email": "suresh.reddy@example.com"
    },
    {
        "aadhaar_number": "9908-9012-3456",
        "full_name": "Priya Rajesh Nair",
        "date_of_birth": "1994-04-28",
        "gender": "Female",
        "address": "33, Panampilly Nagar",
        "village": "Elamkulam",
        "taluk": "Kanayannur",
        "district": "Ernakulam",
        "state": "Kerala",
        "pincode": "682036",
        "phone_number": "9847123456",
        "email": "priya.nair@example.com"
    },
    {
        "aadhaar_number": "9909-0123-4567",
        "full_name": "Rohit Arvind Deshmukh",
        "date_of_birth": "1987-01-15",
        "gender": "Male",
        "address": "77, Kothrud DP Road",
        "village": "Kothrud",
        "taluk": "Haveli",
        "district": "Pune",
        "state": "Maharashtra",
        "pincode": "411038",
        "phone_number": "9822123456",
        "email": "rohit.deshmukh@example.com"
    },
    {
        "aadhaar_number": "9910-1234-5678",
        "full_name": "Aditi Verma",
        "date_of_birth": "1996-06-08",
        "gender": "Female",
        "address": "12, Hazratganj Park Avenue",
        "village": "Hazratganj",
        "taluk": "Lucknow",
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "pincode": "226001",
        "phone_number": "9839123456",
        "email": "aditi.verma@example.com"
    }
]

# Dynamically generate 42 more synthetic profiles to exceed 50+ records
first_names = ["Rajesh", "Vijay", "Deepa", "Sanjay", "Kavitha", "Manoj", "Divya", "Arun", "Sneha", "Girish", "Swathi", "Ramesh", "Pooja", "Vikram", "Geetha", "Naveen", "Revathi", "Balaji", "Sandhya", "Harish", "Bhavani"]
last_names = ["Kumar", "Krishnan", "Patel", "Murugan", "Iyer", "Gopal", "Shukla", "Shetty", "Pillai", "Choudhary", "Naidu", "Menon", "Joshi", "Bhat", "Rao", "Hegde", "Gupta", "Pandey", "Das", "Venkatesan"]
districts_tn = [
    ("Velachery", "Guindy", "Chennai", "Tamil Nadu", "600042"),
    ("Tambaram", "Tambaram", "Chengalpattu", "Tamil Nadu", "600045"),
    ("Saravanampatti", "Coimbatore North", "Coimbatore", "Tamil Nadu", "641035"),
    ("Avadi", "Avadi", "Tiruvallur", "Tamil Nadu", "600054"),
    ("K.K. Nagar", "Madurai South", "Madurai", "Tamil Nadu", "625020"),
    ("Fairlands", "Salem North", "Salem", "Tamil Nadu", "636016"),
    ("K.K. Nagar", "Tiruchirappalli East", "Tiruchirappalli", "Tamil Nadu", "620021"),
    ("Palayamkottai", "Palayamkottai", "Tirunelveli", "Tamil Nadu", "627002"),
    ("Erode Fort", "Erode", "Erode", "Tamil Nadu", "638001"),
    ("Vellore Town", "Vellore", "Vellore", "Tamil Nadu", "632004"),
]

for idx in range(11, 55):
    f_name = first_names[(idx * 3) % len(first_names)]
    l_name = last_names[(idx * 7) % len(last_names)]
    dist_info = districts_tn[idx % len(districts_tn)]
    dob_year = 1970 + (idx % 32)
    dob_month = (idx % 12) + 1
    dob_day = (idx % 28) + 1
    gender = "Female" if idx % 2 == 0 else "Male"
    
    padded_id = str(idx).zfill(2)
    aadhaar_num = f"99{padded_id}-{(idx*137)%9000 + 1000}-{(idx*251)%9000 + 1000}"
    
    DEMO_SYNTHETIC_AADHAAR_PROFILES.append({
        "aadhaar_number": aadhaar_num,
        "full_name": f"{f_name} {l_name}",
        "date_of_birth": f"{dob_year}-{str(dob_month).zfill(2)}-{str(dob_day).zfill(2)}",
        "gender": gender,
        "address": f"Door No. {idx*3 + 1}, Cross Street {idx%5 + 1}, {dist_info[0]}",
        "village": dist_info[0],
        "taluk": dist_info[1],
        "district": dist_info[2],
        "state": dist_info[3],
        "pincode": dist_info[4],
        "phone_number": f"98{str(idx*123456 % 90000000 + 10000000)}",
        "email": f"{f_name.lower()}.{l_name.lower()}{idx}@example.com"
    })


class MockAadhaarService:
    """
    Mock Aadhaar Identity Verification Engine.
    Operates strictly on synthetic demo data for testing & hackathon demonstration.
    """
    
    @staticmethod
    def normalize_aadhaar(aadhaar: str) -> str:
        """Strips non-digit characters and returns clean 12 digits or formatted XXXX-XXXX-XXXX."""
        clean = re.sub(r'\D', '', aadhaar or '')
        return clean

    @staticmethod
    def format_aadhaar(clean_12: str) -> str:
        """Formats 12 digits as XXXX-XXXX-XXXX."""
        if len(clean_12) == 12:
            return f"{clean_12[:4]}-{clean_12[4:8]}-{clean_12[8:]}"
        return clean_12

    @staticmethod
    def mask_aadhaar(aadhaar: str) -> str:
        """Masks Aadhaar showing only last 4 digits (e.g. XXXX-XXXX-4819)."""
        clean = re.sub(r'\D', '', aadhaar or '')
        if len(clean) >= 4:
            return f"XXXX-XXXX-{clean[-4:]}"
        return "XXXX-XXXX-XXXX"

    @staticmethod
    def validate_format(aadhaar: str) -> bool:
        """Validates that Aadhaar has 12 numeric digits."""
        clean = re.sub(r'\D', '', aadhaar or '')
        return len(clean) == 12

    @staticmethod
    def seed_mock_profiles_if_empty(db: Session) -> int:
        """Seeds all 50+ synthetic Aadhaar profiles if table is empty."""
        count = db.query(MockAadhaarProfile).count()
        if count >= len(DEMO_SYNTHETIC_AADHAAR_PROFILES):
            return count
            
        seeded = 0
        for item in DEMO_SYNTHETIC_AADHAAR_PROFILES:
            existing = db.query(MockAadhaarProfile).filter(
                MockAadhaarProfile.aadhaar_number == item["aadhaar_number"]
            ).first()
            if not existing:
                profile = MockAadhaarProfile(**item)
                db.add(profile)
                seeded += 1
                
        db.commit()
        return db.query(MockAadhaarProfile).count()

    @staticmethod
    def find_by_aadhaar(db: Session, raw_aadhaar: str) -> Optional[MockAadhaarProfile]:
        """Finds a synthetic demo profile matching raw or formatted Aadhaar."""
        clean = MockAadhaarService.normalize_aadhaar(raw_aadhaar)
        formatted = MockAadhaarService.format_aadhaar(clean)
        
        profile = db.query(MockAadhaarProfile).filter(
            (MockAadhaarProfile.aadhaar_number == formatted) | 
            (MockAadhaarProfile.aadhaar_number == clean)
        ).first()
        
        # If not found directly, try finding the first seeded demo profile for standard test Aadhaar
        if not profile and clean == "123456789012":
            profile = db.query(MockAadhaarProfile).first()
            
        return profile

    @staticmethod
    def get_all_demo_profiles(db: Session, limit: int = 60) -> List[MockAadhaarProfile]:
        """Returns list of synthetic demo profiles for UI testing selector."""
        return db.query(MockAadhaarProfile).limit(limit).all()

mock_aadhaar_service = MockAadhaarService()
