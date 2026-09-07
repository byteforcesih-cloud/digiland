from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.notification import Notification, MockMessageLog

class NotificationService:
    """
    Notification dispatch service.
    Creates in-app notifications and logs mock SMS & Email transmissions.
    """

    @classmethod
    def send_notification(
        cls,
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notification_type: str,
        reference_type: Optional[str] = None,
        reference_id: Optional[int] = None,
        channel: str = "IN_APP",
        user_email: Optional[str] = None,
        user_phone: Optional[str] = None
    ) -> Notification:
        # 1. Create In-App Notification
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            reference_type=reference_type,
            reference_id=reference_id,
            channel=channel
        )
        db.add(notif)

        # 2. Dispatch mock email if requested
        if channel in ("EMAIL_MOCK", "ALL") and user_email:
            email_log = MockMessageLog(
                recipient_identifier=user_email,
                channel="EMAIL",
                template_type=notification_type,
                payload=f"Subject: {title}\nBody: {message}\nDispatched at: {datetime.now(timezone.utc).isoformat()}",
                status="DELIVERED"
            )
            db.add(email_log)

        # 3. Dispatch mock SMS if requested
        if channel in ("SMS_MOCK", "ALL") and user_phone:
            sms_log = MockMessageLog(
                recipient_identifier=user_phone,
                channel="SMS",
                template_type=notification_type,
                payload=f"[DigiLand Alert] {title}: {message[:120]}...",
                status="DELIVERED"
            )
            db.add(sms_log)

        db.commit()
        db.refresh(notif)
        return notif
