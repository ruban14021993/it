from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class ProductResponse(BaseModel):
    id: str
    category_id: Optional[str] = None
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    hero_image_id: Optional[str] = None
    hero_video_url: Optional[str] = None
    features: list
    benefits: list
    use_cases: list
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool
    is_featured: bool
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class ServiceResponse(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    image_id: Optional[str] = None
    features: list
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool
    is_featured: bool
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class IndustryResponse(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    image_id: Optional[str] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class TrainingResponse(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    image_id: Optional[str] = None
    duration: Optional[str] = None
    features: list
    who_can_apply: list
    what_you_gain: list
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
