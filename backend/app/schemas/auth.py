from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    age: int = Field(..., ge=18, description="Age must be 18 or above")
    aadhaar_number: Optional[str] = Field(None, description="Optional Aadhaar number")
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    role: Optional[str] = "CITIZEN"
    preferred_language: Optional[str] = "en"

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Password and confirm password do not match")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        cleaned = "".join(filter(str.isdigit, v))
        if len(cleaned) < 10:
            raise ValueError("Phone number must contain at least 10 valid digits")
        return cleaned

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    full_name: str
    email: str
    preferred_language: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str = Field(..., min_length=6)
    confirm_new_password: str = Field(..., min_length=6)

    @field_validator("confirm_new_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("New passwords do not match")
        return v

class OfficerProfileOut(BaseModel):
    id: int
    officer_code: str
    badge_number: str
    designation: str
    department: str
    state: str
    district: str
    taluk: str
    jurisdiction_scope: Optional[str] = None
    is_authorized: bool
    total_verifications_completed: int

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    age: int
    aadhaar_masked: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    preferred_language: str
    created_at: datetime
    officer_profile: Optional[OfficerProfileOut] = None

    class Config:
        from_attributes = True
