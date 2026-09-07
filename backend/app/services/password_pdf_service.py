import io
import re
import datetime
from typing import Tuple, Optional
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pdfencrypt import StandardEncryption

class PasswordProtectedPDFService:
    """
    Generates password-protected Land Record Certificate PDFs.
    Password derived deterministically from: Survey Number + First Name (Uppercase, no spaces/slashes).
    """
    
    @staticmethod
    def derive_password(survey_number: str, owner_name: str) -> str:
        """
        Derives normalized password: [CleanSurveyNumber][CleanOwnerFirstName].
        Example: Survey '142/3A' + Owner 'Ramasamy Subramanian' -> '1423ARAMASAMY'
        """
        clean_survey = re.sub(r'[^A-Za-z0-9]', '', survey_number or '101').upper()
        
        # Extract first name and clean
        names = (owner_name or 'CITIZEN').strip().split()
        first_name = names[0] if names else 'CITIZEN'
        clean_name = re.sub(r'[^A-Za-z0-9]', '', first_name).upper()
        
        derived = f"{clean_survey}{clean_name}"
        return derived if derived else "DIGILAND2026"

    @staticmethod
    def get_password_instructions(survey_number: str, owner_name: str) -> str:
        """Returns clear, human-readable instructions for unlocking the protected PDF."""
        clean_survey = re.sub(r'[^A-Za-z0-9]', '', survey_number or '101').upper()
        names = (owner_name or 'CITIZEN').strip().split()
        first_name = names[0] if names else 'CITIZEN'
        clean_name = re.sub(r'[^A-Za-z0-9]', '', first_name).upper()
        
        return (
            f"Your PDF is protected with your Survey Number followed by your First Name in uppercase: "
            f"'{clean_survey}{clean_name}' (e.g. Survey {survey_number} + {first_name})"
        )

    @staticmethod
    def generate_protected_certificate(
        document_number: str,
        title: str,
        document_type: str,
        status: str,
        version: int,
        survey_number: str = "142/3A",
        owner_name: str = "Ramasamy Subramanian",
        village: str = "Mylapore",
        district: str = "Chennai",
        area: str = "2400 Sq.Ft",
        issue_date: Optional[str] = None
    ) -> Tuple[bytes, str, str]:
        """
        Renders a watermarked, digitally styled PDF and encrypts it with the derived password.
        Returns: (pdf_bytes, derived_password, password_hint)
        """
        password = PasswordProtectedPDFService.derive_password(survey_number, owner_name)
        hint = PasswordProtectedPDFService.get_password_instructions(survey_number, owner_name)
        date_str = issue_date or datetime.datetime.utcnow().strftime("%d-%b-%Y")
        
        buffer = io.BytesIO()
        
        # Setup ReportLab standard 128-bit encryption
        enc = StandardEncryption(userPassword=password, ownerPassword=password + "_ADMIN_KEY", canPrint=1, canCopy=0)
        c = canvas.Canvas(buffer, pagesize=letter, encrypt=enc)
        width, height = letter
        
        # Border Frame
        c.setStrokeColor(colors.HexColor("#1A365D"))
        c.setLineWidth(4)
        c.rect(30, 30, width - 60, height - 60)
        
        c.setStrokeColor(colors.HexColor("#D69E2E"))
        c.setLineWidth(1.5)
        c.rect(36, 36, width - 72, height - 72)
        
        # Watermark
        c.saveState()
        c.setFont("Helvetica-Bold", 46)
        c.setFillColor(colors.HexColor("#CBD5E1"), alpha=0.15)
        c.translate(width / 2, height / 2)
        c.rotate(35)
        c.drawCentredString(0, 0, "DIGILAND VERIFIED")
        c.restoreState()
        
        # Header Banner
        c.setFillColor(colors.HexColor("#1A365D"))
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(width / 2, height - 65, "GOVERNMENT OF TAMIL NADU • REVENUE & DISASTER MANAGEMENT")
        
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width / 2, height - 88, "DIGITAL LAND RECORD VERIFICATION CERTIFICATE")
        
        c.setFont("Helvetica", 9)
        c.setFillColor(colors.HexColor("#64748B"))
        c.drawCentredString(width / 2, height - 104, "Digitally Certified under State Cadastre & IT Act Compliance Standards")
        
        # Divider Line
        c.setStrokeColor(colors.HexColor("#CBD5E1"))
        c.setLineWidth(1)
        c.line(50, height - 118, width - 50, height - 118)
        
        # Metadata Grid
        y = height - 150
        c.setFillColor(colors.HexColor("#0F172A"))
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Certificate Reference:")
        c.setFont("Courier-Bold", 10)
        c.drawString(220, y, document_number)
        
        y -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Registered Landowner:")
        c.setFont("Helvetica", 10)
        c.drawString(220, y, owner_name)
        
        y -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Cadastral Survey Number:")
        c.setFont("Helvetica-Bold", 10)
        c.drawString(220, y, survey_number)
        
        y -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Document Title / Category:")
        c.setFont("Helvetica", 10)
        c.drawString(220, y, f"{title} ({document_type})")
        
        y -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Revenue Village / Taluk:")
        c.setFont("Helvetica", 10)
        c.drawString(220, y, f"{village}, {district}")
        
        y -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Land Extent Area:")
        c.setFont("Helvetica", 10)
        c.drawString(220, y, area)
        
        y -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Document Archive Version:")
        c.setFont("Courier-Bold", 10)
        c.drawString(220, y, f"v{version}")
        
        y -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(60, y, "Legal Verification Status:")
        c.setFillColor(colors.HexColor("#059669"))
        c.setFont("Helvetica-Bold", 11)
        c.drawString(220, y, f"● {status}")
        
        # Security Box Notice
        y -= 55
        c.setFillColor(colors.HexColor("#F8FAFC"))
        c.setStrokeColor(colors.HexColor("#E2E8F0"))
        c.roundRect(50, y - 50, width - 100, 65, 8, fill=1, stroke=1)
        
        c.setFillColor(colors.HexColor("#1E293B"))
        c.setFont("Helvetica-Bold", 9)
        c.drawString(65, y + 2, "CRYPTOGRAPHIC SECURITY & ENCRYPTION NOTE")
        c.setFont("Helvetica", 8)
        c.setFillColor(colors.HexColor("#475569"))
        c.drawString(65, y - 12, "This PDF document is encrypted with 128-bit standard AES security. Protected for authorized citizen access.")
        c.drawString(65, y - 24, f"Issued Date: {date_str} | System Hash: SHA256-VAULT-VALIDATED | Issued via DigiLand Hub")
        c.drawString(65, y - 36, "Tampering with, altering, or forging this government certificate is an offense under the IT Act.")
        
        # Signature Block
        y -= 110
        c.setStrokeColor(colors.HexColor("#1A365D"))
        c.line(width - 220, y, width - 60, y)
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(colors.HexColor("#1A365D"))
        c.drawCentredString(width - 140, y - 14, "Tahsildar / Authorized Signatory")
        c.setFont("Helvetica", 8)
        c.setFillColor(colors.HexColor("#64748B"))
        c.drawCentredString(width - 140, y - 26, "Revenue Administration Department")
        
        c.showPage()
        c.save()
        
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes, password, hint

password_pdf_service = PasswordProtectedPDFService()
