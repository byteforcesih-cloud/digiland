import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.email_log import EmailDeliveryLog

class EmailNotificationService:
    """
    Python SMTP Email Notification Service with BackgroundTask dispatch and mock fallback.
    Records delivery status (PENDING, SENT, FAILED, RETRYING) in the database.
    """
    
    TEMPLATES = {
        "DOCUMENT_UPLOADED": {
            "subject": "DigiLand: Land Document Uploaded Successfully",
            "body": "Dear Citizen,\n\nYour land document '{title}' (Ref: {doc_number}) has been uploaded to the DigiLand portal. Our AI OCR neural engine is now processing and extracting cadastral fields.\n\nYou can track the verification progress in your Citizen Portal.\n\nRegards,\nDigiLand Portal Administration"
        },
        "DOCUMENT_VERIFIED": {
            "subject": "DigiLand: Land Record Verified & Certified",
            "body": "Dear Citizen,\n\nYour land record '{title}' (Survey No: {survey_number}) has been officially VERIFIED by the Tahsildar / Revenue Department.\n\nYou can now download your official digitally watermarked Land Record Verification Certificate from your dashboard.\n\nRegards,\nRevenue Administration Department"
        },
        "DOCUMENT_REJECTED": {
            "subject": "DigiLand: Land Document Verification Notice - Action Required",
            "body": "Dear Citizen,\n\nYour land document '{title}' (Ref: {doc_number}) was reviewed by the revenue officer and could not be verified due to the following reason:\n\n'{remarks}'\n\nPlease log in to DigiLand to upload revised documentation or contact your Taluk office.\n\nRegards,\nRevenue Administration Department"
        },
        "CORRECTION_REQUESTED": {
            "subject": "DigiLand: Document Discrepancy - Correction Requested",
            "body": "Dear Citizen,\n\nThe Revenue Officer has requested clarification or corrections for document '{title}'.\n\nOfficer Remarks: {remarks}\n\nPlease submit an updated document version in your Citizen Workbench.\n\nRegards,\nDigiLand Support"
        },
        "IDENTITY_VERIFIED": {
            "subject": "DigiLand: Digital Identity Verified Successfully",
            "body": "Dear Citizen,\n\nYour mock digital identity for Aadhaar '{aadhaar_masked}' has been successfully verified in the DigiLand system.\n\nYou now have full access to personal land archives, 'My Secure Storage', and certificate generation.\n\nRegards,\nDigiLand Identity Security"
        },
        "PASSWORD_RESET": {
            "subject": "DigiLand: Password Reset Request",
            "body": "Dear User,\n\nA password reset request was initiated for your DigiLand account. Use the following verification token to reset your credentials:\n\nReset Token: {token}\n\nThis token will expire in 15 minutes. If you did not request this, please contact support.\n\nRegards,\nDigiLand Security"
        },
        "STORAGE_WARNING": {
            "subject": "DigiLand: Personal Storage Limit Warning",
            "body": "Dear Citizen,\n\nYour personal document storage vault is nearing capacity ({used_mb} MB of {quota_mb} MB used). Please archive or remove unnecessary files to continue uploading.\n\nRegards,\nDigiLand Storage Operations"
        }
    }
    
    @staticmethod
    def send_email_sync(
        db: Session,
        recipient_email: str,
        template_type: str,
        template_vars: Dict[str, Any],
        user_id: Optional[int] = None
    ) -> bool:
        """
        Synchronous email delivery attempt with automatic database logging.
        Falls back safely to simulated log if SMTP is not configured.
        """
        template = EmailNotificationService.TEMPLATES.get(template_type, {
            "subject": "DigiLand Portal Notification",
            "body": "You have a new update in your DigiLand account."
        })
        
        subject = template["subject"]
        body = template["body"].format(**template_vars) if template_vars else template["body"]
        
        log_entry = EmailDeliveryLog(
            user_id=user_id,
            recipient_email=recipient_email,
            subject=subject,
            body_text=body,
            template_type=template_type,
            status="PENDING",
            extra_payload=template_vars or {}
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        
        # Check if real SMTP credentials are provided
        if settings.SMTP_PASSWORD and settings.SMTP_USERNAME:
            try:
                msg = MIMEMultipart()
                msg['From'] = settings.SMTP_FROM_EMAIL
                msg['To'] = recipient_email
                msg['Subject'] = subject
                msg.attach(MIMEText(body, 'plain'))
                
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                    if settings.SMTP_USE_TLS:
                        server.starttls()
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                    server.send_message(msg)
                    
                log_entry.status = "SENT"
                log_entry.sent_at = datetime.utcnow()
                db.commit()
                return True
            except Exception as e:
                log_entry.status = "FAILED"
                log_entry.error_message = str(e)
                log_entry.retry_count += 1
                db.commit()
                print(f"[SMTP SEND ERROR] {e}")
                return False
        else:
            # Simulated Dev Mock Email Delivery
            log_entry.status = "SENT"
            log_entry.sent_at = datetime.utcnow()
            log_entry.error_message = "Delivered via Mock Provider (Dev Mode)"
            db.commit()
            print(f"\n[MOCK EMAIL DISPATCHED] To: {recipient_email} | Subject: {subject}\n{body}\n")
            return True

email_service = EmailNotificationService()
