import re
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.aadhaar import MockAadhaarProfile

class PhoneValidationService:
    """
    Normalizes and validates registered user phone numbers against Mock Aadhaar records.
    Strictly prevents OTP generation and identity verification if phone numbers do not match.
    """

    @staticmethod
    def normalize_phone(phone: Optional[str]) -> str:
        """
        Normalizes phone number to 10 standard digits:
        e.g. '+91 98401-23456' -> '9840123456'
             '09840123456'     -> '9840123456'
        """
        if not phone:
            return ""
        # Remove all non-digit characters
        digits = re.sub(r"\D", "", phone.strip())
        # If starts with 91 and has 12 digits, strip country code
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        # If starts with 0 and has 11 digits, strip leading zero
        elif len(digits) == 11 and digits.startswith("0"):
            digits = digits[1:]
        return digits

    @classmethod
    def validate_phone_match(
        cls, 
        db: Session, 
        user: User, 
        mock_profile: MockAadhaarProfile
    ) -> Tuple[bool, str]:
        """
        Compares normalized user phone against Mock Aadhaar record phone.
        Returns (is_match, error_message_or_masked_phone).
        """
        user_phone = cls.normalize_phone(user.phone)
        aadhaar_phone = cls.normalize_phone(mock_profile.phone_number)

        if not user_phone:
            return False, "User profile is missing a registered phone number. Please update your profile first."

        if not aadhaar_phone:
            return False, "Selected Mock Aadhaar record has no linked phone number."

        if user_phone != aadhaar_phone:
            return False, "The phone number associated with this account does not match the phone number linked to the provided Mock Aadhaar record."

        # Masked phone for display (e.g. XXXXXX3456)
        masked = "X" * (len(aadhaar_phone) - 4) + aadhaar_phone[-4:]
        return True, masked

phone_validation_service = PhoneValidationService()
