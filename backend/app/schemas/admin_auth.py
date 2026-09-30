from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class AdminUserBase(BaseModel):
    id: str
    email: EmailStr
    name: str
    is_active: bool

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLoginResponse(Token):
    admin: AdminUserBase
