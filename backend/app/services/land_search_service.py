from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, distinct
from app.models.land import LandRecord, GISData

class LandSearchService:
    """
    Smart Land Search & Cascading Autocomplete Engine.
    Provides dependent dropdown hierarchy (State -> District -> Taluk -> Village)
    and field autocomplete suggestions.
    """
    
    # Location Hierarchy Knowledge Base
    LOCATION_HIERARCHY = {
        "Tamil Nadu": {
            "Chennai": {
                "Mylapore": ["Mylapore", "Royapettah", "Alwarpet", "Mandaveli", "San Thome"],
                "Guindy": ["Guindy", "Velachery", "Adyar", "Besant Nagar", "Thiruvanmiyur"],
                "Egmore": ["Egmore", "Chetpet", "Kilpauk", "Nungambakkam"],
                "Tondiarpet": ["Tondiarpet", "Royapuram", "George Town", "Washermanpet"]
            },
            "Coimbatore": {
                "Coimbatore North": ["RS Puram", "Saibaba Colony", "Saravanampatti", "Ganapathy"],
                "Coimbatore South": ["Ramanathapuram", "Singanallur", "Sundarapuram", "Kuniyamuthur"],
                "Pollachi": ["Pollachi Town", "Anamalai", "Negamam", "Kinathukadavu"]
            },
            "Madurai": {
                "Madurai South": ["Madurai South", "K.K. Nagar", "Palanganatham", "Villapuram"],
                "Madurai North": ["Tallakulam", "Sellur", "Othakadai", "Goripalayam"],
                "Melur": ["Melur", "Kottampatti", "Vellalur"]
            },
            "Salem": {
                "Salem West": ["Hasthampatti", "Shevapet", "Suramangalam", "Kandhampatti"],
                "Salem North": ["Fairlands", "Gorimedu", "Alagapuram", "Kannankurichi"],
                "Attur": ["Attur Town", "Thalaivasal", "Mallur"]
            },
            "Tiruchirappalli": {
                "Tiruchirappalli West": ["Thillai Nagar", "Cantonment", "Woraiyur", "Tennur"],
                "Tiruchirappalli East": ["K.K. Nagar", "Palakkarai", "Ponmalai", "Ariyamangalam"],
                "Srirangam": ["Srirangam Town", "Thiruvanaikoil", "Gunaseelam"]
            }
        },
        "Karnataka": {
            "Bengaluru Urban": {
                "Bengaluru East": ["Indiranagar", "Whitefield", "Marathahalli", "KR Puram"],
                "Bengaluru South": ["Jayanagar", "JP Nagar", "BTM Layout", "Banashankari"],
                "Bengaluru North": ["Malleshwaram", "Hebbal", "Yelahanka", "R.T. Nagar"]
            },
            "Mysuru": {
                "Mysuru North": ["Gokulam", "V.V. Mohalla", "Vijayanagar", "Hebbal Industrial"],
                "Mysuru South": ["Kuvempunagar", "Saraswathipuram", "Ramakrishnanagar"]
            }
        },
        "Telangana": {
            "Hyderabad": {
                "Shaikpet": ["Banjara Hills", "Jubilee Hills", "Tolichowki", "Filmnagar"],
                "Khairatabad": ["Somajiguda", "Ameerpet", "Punjagutta", "Panjagutta"],
                "Secunderabad": ["Begumpet", "Marredpally", "Bowenpally", "Tarnaka"]
            }
        },
        "Maharashtra": {
            "Pune": {
                "Haveli": ["Kothrud", "Aundh", "Baner", "Viman Nagar", "Hinjawadi"],
                "Pune City": ["Shivajinagar", "Camp", "Deccan Gymkhana", "Koregaon Park"]
            }
        }
    }

    @staticmethod
    def get_states() -> List[str]:
        return list(LandSearchService.LOCATION_HIERARCHY.keys())

    @staticmethod
    def get_districts(state: str = "Tamil Nadu") -> List[str]:
        return list(LandSearchService.LOCATION_HIERARCHY.get(state, {}).keys())

    @staticmethod
    def get_taluks(district: str, state: str = "Tamil Nadu") -> List[str]:
        dist_dict = LandSearchService.LOCATION_HIERARCHY.get(state, {}).get(district, {})
        return list(dist_dict.keys())

    @staticmethod
    def get_villages(taluk: str, district: str, state: str = "Tamil Nadu") -> List[str]:
        dist_dict = LandSearchService.LOCATION_HIERARCHY.get(state, {}).get(district, {})
        return dist_dict.get(taluk, [])

    @staticmethod
    def get_autocomplete_suggestions(db: Session, query: str, field: Optional[str] = None) -> List[Dict[str, str]]:
        """
        Returns fast suggestions matching partial query for owner, survey, patta, or village.
        """
        if not query or len(query.strip()) < 1:
            return []
            
        term = f"%{query.strip()}%"
        results = []
        
        # Query survey numbers
        if not field or field == "survey_number":
            surveys = db.query(LandRecord.survey_number, LandRecord.village, LandRecord.district)\
                .filter(LandRecord.survey_number.ilike(term)).limit(5).all()
            for s in surveys:
                results.append({"type": "Survey Number", "value": s[0], "subtext": f"{s[1]}, {s[2]}"})
                
        # Query Owner Names
        if not field or field == "owner_name":
            owners = db.query(LandRecord.owner_name, LandRecord.survey_number, LandRecord.district)\
                .filter(LandRecord.owner_name.ilike(term)).limit(5).all()
            for o in owners:
                results.append({"type": "Landowner", "value": o[0], "subtext": f"Survey {o[1]} • {o[2]}"})
                
        # Query Patta Numbers
        if not field or field == "patta_number":
            pattas = db.query(LandRecord.patta_number, LandRecord.owner_name, LandRecord.village)\
                .filter(LandRecord.patta_number.ilike(term)).limit(5).all()
            for p in pattas:
                if p[0]:
                    results.append({"type": "Patta Number", "value": p[0], "subtext": f"{p[1]} • {p[2]}"})

        # Query Villages / Localities
        if not field or field == "village":
            villages = db.query(distinct(LandRecord.village), LandRecord.district)\
                .filter(LandRecord.village.ilike(term)).limit(5).all()
            for v in villages:
                results.append({"type": "Village / Locality", "value": v[0], "subtext": f"District: {v[1]}"})

        return results[:10]

land_search_service = LandSearchService()
