from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
import re


class PyObjectId(str):
    """Custom ObjectId class for Pydantic models compatibility"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(ObjectId(v))

    @classmethod
    def __get_pydantic_json_schema__(cls, _schema_generator):
        return {"type": "string"}


class UserBase(BaseModel):
    """Base user model with common fields"""
    email: EmailStr
    name: str
    
class UserMetadata(BaseModel):
    """User metadata model"""
    sso_provider: Optional[str] = None
    sso_id: Optional[str] = None
    sso_uuid: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_business: Optional[bool] = None
    businesses: Optional[List[Dict[str, Any]]] = None
    custom_data: Optional[Dict[str, Any]] = Field(default_factory=dict)


class UserCreate(UserBase):
    """User creation model"""
    password: str
    metadata: Optional[UserMetadata] = None

    @validator('password')
    def password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least one number")
        return v


class UserUpdate(BaseModel):
    """User update model"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    active: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None


class PaymentMethod(BaseModel):
    """Payment method model"""
    type: str
    last_four: Optional[str] = None
    expiry: Optional[str] = None
    provider_id: Optional[str] = None
    additional_info: Optional[Dict[str, Any]] = None


class Payment(BaseModel):
    """Payment model"""
    transaction_id: str
    amount: float
    currency: str
    status: str
    date: datetime


class UserSubscription(BaseModel):
    """User subscription model"""
    status: str
    plan: str
    start_date: datetime
    end_date: datetime
    auto_renew: bool
    updated_at: datetime
    payment_method: Optional[PaymentMethod] = None
    features: Optional[List[str]] = None
    payment_history: Optional[List[Payment]] = None


class User(UserBase):
    """User response model"""
    id: str
    active: Optional[bool] = True
    role: Optional[str] = "user"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None
    subscription: Optional[UserSubscription] = None


class UserInDB(User):
    """User model in database"""
    hashed_password: str


class UserResponse(BaseModel):
    """User response model"""
    id: str
    email: EmailStr
    name: str
    active: bool = True
    role: str = "user"
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    subscription: Optional[UserSubscription] = None


class Token(BaseModel):
    """Token model"""
    access_token: str
    token_type: str
    expires_at: datetime


class TokenData(BaseModel):
    """Token data model"""
    sub: Optional[str] = None 