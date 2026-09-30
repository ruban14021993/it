from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class HomepageResponse(BaseModel):
    id: str
    eyebrow: Optional[str] = None
    heading: str
    description: Optional[str] = None
    primary_cta_text: Optional[str] = None
    primary_cta_url: Optional[str] = None
    secondary_cta_text: Optional[str] = None
    secondary_cta_url: Optional[str] = None
    image_id: Optional[str] = None
    is_active: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class HomepageUpdate(BaseModel):
    eyebrow: Optional[str] = None
    heading: Optional[str] = None
    description: Optional[str] = None
    primary_cta_text: Optional[str] = None
    primary_cta_url: Optional[str] = None
    secondary_cta_text: Optional[str] = None
    secondary_cta_url: Optional[str] = None
    image_id: Optional[str] = None
    is_active: Optional[bool] = None

class AboutResponse(BaseModel):
    id: str
    company_name: str
    tagline: Optional[str] = None
    overview: Optional[str] = None
    founder_name: Optional[str] = None
    founder_title: Optional[str] = None
    founder_message: Optional[str] = None
    founded_year: Optional[int] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    future_vision: Optional[str] = None
    values: Optional[str] = None
    commitment_items: list
    why_choose_items: list
    hero_image_id: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AboutUpdate(BaseModel):
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    overview: Optional[str] = None
    founder_name: Optional[str] = None
    founder_title: Optional[str] = None
    founder_message: Optional[str] = None
    founded_year: Optional[int] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    future_vision: Optional[str] = None
    values: Optional[str] = None
    commitment_items: Optional[list] = None
    why_choose_items: Optional[list] = None
    hero_image_id: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class ContactResponse(BaseModel):
    id: str
    primary_email: Optional[str] = None
    hr_email: Optional[str] = None
    primary_phone: Optional[str] = None
    secondary_phone: Optional[str] = None
    contact_form_enabled: bool
    contact_form_recipient: Optional[str] = None
    business_hours: Optional[str] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ContactUpdate(BaseModel):
    primary_email: Optional[str] = None
    hr_email: Optional[str] = None
    primary_phone: Optional[str] = None
    secondary_phone: Optional[str] = None
    contact_form_enabled: Optional[bool] = None
    contact_form_recipient: Optional[str] = None
    business_hours: Optional[str] = None

class BranchResponse(BaseModel):
    id: str
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BranchCreate(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    display_order: int = 1
    is_active: bool = True

class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class EnquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EnquiryUpdate(BaseModel):
    status: Optional[str] = None
