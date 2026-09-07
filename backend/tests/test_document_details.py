import pytest
from app.services.document_details_service import document_details_service

SAMPLE_PATTA_OCR = """
GOVERNMENT OF TAMIL NADU - REVENUE DEPARTMENT
EXTRACT OF PATTA / CHITTA (FORM 11)
District: Chennai
Taluk: Mylapore
Village: Mylapore
Patta Number: PATTA-6334
Survey Number: 142/3A
Sub-Division: 3A
Plot Number: Plot 12
Land Classification: Ryotwari Wet Land (Nanja)
Total Extent: 2,400 Sq.Ft
Pattadhar Name: Ramasamy Subramanian
Father's Name: Subramanian Ramasamy
Door No: No. 42/B
Street: Luz Church Road
Pincode: 600004
Date of Issue: 15/08/2026
Registration No: DOC-TN-2026-0042
[SYNTHETIC DEMO RECORD — NOT A GOVERNMENT DOCUMENT]
"""

SAMPLE_SALE_DEED_OCR = """
REGISTERED DEED OF ABSOLUTE SALE
Document Number: DOC-TN-2026-9901
Registration Date: 12/04/2026
Sub-Registrar Office: Mylapore SRO
Vendor: Dr. K. Ananthakrishnan
Purchaser / Buyer: Meenakshi Sundaresan
Husband's Name: Sundaresan Natarajan
Schedule of Property:
Survey No: 305/1C
Village: Villapuram
Taluk: Madurai South
District: Madurai
State: Tamil Nadu
Door No: Plot 18
Street: Meenakshi Nagar 2nd Street
Total Area: 1,800 Sq.Ft
Classification: Grama Natham Residential Plot
[SYNTHETIC DEMO RECORD — NOT A GOVERNMENT DOCUMENT]
"""

def test_document_details_extraction_patta():
    result = document_details_service.extract_structured_details(SAMPLE_PATTA_OCR, "PATTA_CHITTA")
    assert result["success"] is True
    assert result["document_type"] == "PATTA_CHITTA"
    
    fields = result["fields"]
    assert fields["owner_name"]["value"] == "Ramasamy Subramanian"
    assert fields["owner_name"]["confidence_level"] == "High Confidence"
    assert fields["survey_number"]["value"] == "142/3A"
    assert fields["patta_number"]["value"] == "PATTA-6334"
    assert fields["village"]["value"] == "Mylapore"
    assert fields["taluk"]["value"] == "Mylapore"
    assert fields["district"]["value"] == "Chennai"
    assert fields["land_area"]["value"] == "2,400 Sq.Ft"
    assert fields["pincode"]["value"] == "600004"
    assert result["summary"]["detected_fields_count"] >= 10

def test_document_details_extraction_sale_deed():
    result = document_details_service.extract_structured_details(SAMPLE_SALE_DEED_OCR, "SALE_DEED")
    assert result["success"] is True
    assert result["document_type"] == "SALE_DEED"
    
    fields = result["fields"]
    assert fields["owner_name"]["value"] == "Meenakshi Sundaresan"
    assert fields["survey_number"]["value"] == "305/1C"
    assert fields["village"]["value"] == "Villapuram"
    assert fields["taluk"]["value"] == "Madurai South"
    assert fields["district"]["value"] == "Madurai"
    assert fields["state"]["value"] == "Tamil Nadu"

def test_missing_fields_graceful_handling():
    sparse_ocr = "Land document note without any recognized labels or identifiers."
    result = document_details_service.extract_structured_details(sparse_ocr)
    assert result["success"] is True
    
    fields = result["fields"]
    assert fields["owner_name"]["value"] == "Not Detected"
    assert fields["owner_name"]["confidence"] == 0.0
    assert fields["owner_name"]["confidence_level"] == "Not Detected"
    assert fields["survey_number"]["value"] == "Not Detected"
    assert result["summary"]["detected_fields_count"] == 0

def test_empty_input_handling():
    result = document_details_service.extract_structured_details("")
    assert result["success"] is False
    assert result["fields"]["owner_name"]["value"] == "Not Detected"
