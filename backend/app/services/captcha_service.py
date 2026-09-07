import uuid
import random
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.captcha import CaptchaAttempt

class CaptchaService:
    """
    Server-Side CAPTCHA Challenge & Validation Engine for risk-sensitive actions.
    """
    
    TTL_MINUTES = 5
    
    @staticmethod
    def generate_challenge(db: Session, action_type: str = "SENSITIVE_ACTION", ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        """
        Creates a math/logic CAPTCHA challenge and records the hash in database.
        """
        num1 = random.randint(3, 25)
        num2 = random.randint(2, 15)
        operation = random.choice(["+", "-", "*"])
        
        if operation == "+":
            answer = str(num1 + num2)
            question = f"What is {num1} + {num2}?"
        elif operation == "-":
            # Ensure positive result
            larger = max(num1, num2)
            smaller = min(num1, num2)
            answer = str(larger - smaller)
            question = f"What is {larger} - {smaller}?"
        else:
            n1 = random.randint(2, 9)
            n2 = random.randint(2, 9)
            answer = str(n1 * n2)
            question = f"What is {n1} × {n2}?"
            
        token = f"CAP-{uuid.uuid4().hex[:16].upper()}"
        answer_hash = hashlib.sha256(answer.strip().encode('utf-8')).hexdigest()
        expires_at = datetime.utcnow() + timedelta(minutes=CaptchaService.TTL_MINUTES)
        
        attempt = CaptchaAttempt(
            token=token,
            answer_hash=answer_hash,
            action_type=action_type,
            ip_address=ip_address,
            is_verified=False,
            expires_at=expires_at
        )
        db.add(attempt)
        db.commit()
        
        return {
            "captcha_token": token,
            "question": question,
            "expires_in_seconds": CaptchaService.TTL_MINUTES * 60
        }

    @staticmethod
    def verify_challenge(db: Session, token: str, user_answer: str) -> Tuple[bool, str]:
        """
        Verifies client answer against stored hash.
        """
        if not token:
            return False, "CAPTCHA token is required."
            
        attempt = db.query(CaptchaAttempt).filter(CaptchaAttempt.token == token).first()
        if not attempt:
            return False, "Invalid CAPTCHA session."
            
        if attempt.is_verified:
            return False, "This CAPTCHA challenge has already been verified."
            
        if datetime.utcnow() > attempt.expires_at:
            return False, "CAPTCHA challenge expired. Please refresh the challenge."
            
        clean_ans = str(user_answer or '').strip()
        ans_hash = hashlib.sha256(clean_ans.encode('utf-8')).hexdigest()
        
        if ans_hash != attempt.answer_hash:
            return False, "Incorrect CAPTCHA answer. Please try again."
            
        attempt.is_verified = True
        db.commit()
        return True, "CAPTCHA verified successfully."

captcha_service = CaptchaService()
