from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict

class CategoryPublic(BaseModel):
    name: str
    slug: str
    display_order: int
    
    model_config = {"from_attributes": True}

class MediaPublic(BaseModel):
    id: str
    filename: str
    storage_path: str
    alt_text: Optional[str] = None
    media_type: str
    width: Optional[int] = None
    height: Optional[int] = None
    
    model_config = {"from_attributes": True}

class ProductModulePublic(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    image: Optional[MediaPublic] = None
    display_order: int
    
    model_config = {"from_attributes": True}

class ProductImagePublic(BaseModel):
    id: str
    media: MediaPublic
    display_order: int
    
    model_config = {"from_attributes": True}

class ProductPublic(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    hero_image: Optional[MediaPublic] = None
    hero_video_url: Optional[str] = None
    category: Optional[CategoryPublic] = None
    features: List[Any] = []
    benefits: List[Any] = []
    use_cases: List[Any] = []
    modules: List[ProductModulePublic] = []
    gallery: List[ProductImagePublic] = []
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[MediaPublic] = None
    
    model_config = {"from_attributes": True}

class ServicePublic(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[MediaPublic] = None
    features: List[Any] = []
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[MediaPublic] = None
    
    model_config = {"from_attributes": True}

class IndustryPublic(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    image: Optional[MediaPublic] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool = True
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[MediaPublic] = None
    
    model_config = {"from_attributes": True}

class TrainingPublic(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    image: Optional[MediaPublic] = None
    duration: Optional[str] = None
    features: List[Any] = []
    who_can_apply: List[Any] = []
    what_you_gain: List[Any] = []
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool = True
    display_order: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    
    model_config = {"from_attributes": True}

class AboutPublic(BaseModel):
    id: str
    company_name: str
    founder_name: Optional[str] = None
    founder_title: Optional[str] = None
    founded_year: Optional[int] = None
    
    model_config = {"from_attributes": True}

class BranchPublic(BaseModel):
    id: str
    name: str
    
    model_config = {"from_attributes": True}

class ContactPublic(BaseModel):
    primary_email: Optional[str] = None
    hr_email: Optional[str] = None
    primary_phone: Optional[str] = None
    branches: List[BranchPublic] = []
    
    model_config = {"from_attributes": True}

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class SuccessResponse(BaseModel):
    message: str
