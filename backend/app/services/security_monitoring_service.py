import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.security_monitoring import SecurityEvent, LoginHistory, DeviceSession, SuspiciousActivity

class SecurityMonitoringService:
    """
    Manages active user device sessions, remote revocation, failed login monitoring,
    account lockout checks, and security event auditing.
    """

    MAX_FAILED_LOGINS = 5
    LOCKOUT_DURATION_MINUTES = 15
    SESSION_EXPIRY_DAYS = 7

    @classmethod
    def record_login_attempt(
        cls,
        db: Session,
        email: str,
        is_successful: bool,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        failure_reason: Optional[str] = None,
        user: Optional[User] = None
    ) -> LoginHistory:
        """
        Records an authentication attempt in login_history and evaluates brute-force triggers.
        """
        history_rec = LoginHistory(
            user_id=user.id if user else None,
            user_email=email,
            ip_address=ip_address or "127.0.0.1",
            user_agent=user_agent or "Unknown Browser",
            is_successful=is_successful,
            failure_reason=failure_reason
        )
        db.add(history_rec)

        if not is_successful:
            # Check recent consecutive failures
            since_time = datetime.now(timezone.utc) - timedelta(minutes=cls.LOCKOUT_DURATION_MINUTES)
            recent_failures = (
                db.query(LoginHistory)
                .filter(
                    LoginHistory.user_email == email,
                    LoginHistory.is_successful == False,
                    LoginHistory.created_at >= since_time
                )
                .count()
            )

            if recent_failures >= cls.MAX_FAILED_LOGINS:
                # Log a high severity security event
                event = SecurityEvent(
                    event_type="BRUTE_FORCE_ATTEMPT",
                    severity="HIGH",
                    user_id=user.id if user else None,
                    user_email=email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    details={"consecutive_failures": recent_failures, "window_minutes": cls.LOCKOUT_DURATION_MINUTES}
                )
                db.add(event)

        db.commit()
        db.refresh(history_rec)
        return history_rec

    @classmethod
    def create_device_session(
        cls,
        db: Session,
        user: User,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        device_name: str = "Web Browser on Windows"
    ) -> DeviceSession:
        """
        Registers an active session for the authenticated user.
        """
        token_random = secrets.token_hex(32)
        token_hash = hashlib.sha256(token_random.encode()).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(days=cls.SESSION_EXPIRY_DAYS)

        session = DeviceSession(
            user_id=user.id,
            session_token_hash=token_hash,
            device_name=device_name,
            device_type="Desktop" if "Mobile" not in (user_agent or "") else "Mobile",
            ip_address=ip_address,
            user_agent=user_agent,
            is_active=True,
            expires_at=expires_at
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @classmethod
    def revoke_session(cls, db: Session, session_id: int, user_id: int) -> bool:
        """
        Remotely terminates an active session.
        """
        session = (
            db.query(DeviceSession)
            .filter(DeviceSession.id == session_id, DeviceSession.user_id == user_id)
            .first()
        )
        if not session:
            return False
        session.is_active = False
        db.commit()
        return True

security_monitoring_service = SecurityMonitoringService()
