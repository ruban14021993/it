from pydantic import BaseModel, EmailStr, field_validator
from typing import Any
from datetime import datetime


# ---------------------------------------------------------------------------
# Shared
# ---------------------------------------------------------------------------

class MediaRef(BaseModel):
    id: str
    filename: str
    storage_path: str
    alt_text: str | None = None
    media_type: str
    width: int | None = None
    height: int | None = None

    model_config = {"from_attributes": True}


class PaginationMeta(BaseModel):
    total: int
    page: int
    limit: int
    pages: int


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserOut(BaseModel):
    id: str
    name: str
    email: str
    is_active: bool
    role: str

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Hero Sections
# ---------------------------------------------------------------------------

class HeroSectionOut(BaseModel):
    id: str
    eyebrow: str | None
    heading: str
    description: str | None
    primary_cta_text: str | None
    primary_cta_url: str | None
    secondary_cta_text: str | None
    secondary_cta_url: str | None
    image: MediaRef | None
    is_active: bool
    display_order: int
    updated_at: datetime

    model_config = {"from_attributes": True}


class HeroSectionUpdate(BaseModel):
    eyebrow: str | None = None
    heading: str | None = None
    description: str | None = None
    primary_cta_text: str | None = None
    primary_cta_url: str | None = None
    secondary_cta_text: str | None = None
    secondary_cta_url: str | None = None
    image_id: str | None = None
    is_active: bool | None = None
    display_order: int | None = None


# ---------------------------------------------------------------------------
# Popups
# ---------------------------------------------------------------------------

class PopupOut(BaseModel):
    id: str
    title: str
    description: str | None
    image: MediaRef | None
    cta_text: str | None
    cta_url: str | None
    is_active: bool
    starts_at: datetime | None
    ends_at: datetime | None
    updated_at: datetime

    model_config = {"from_attributes": True}


class PopupCreate(BaseModel):
    title: str
    description: str | None = None
    image_id: str | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool = False
    starts_at: datetime | None = None
    ends_at: datetime | None = None


class PopupUpdate(PopupCreate):
    title: str | None = None


# ---------------------------------------------------------------------------
# Homepage Sections
# ---------------------------------------------------------------------------

class HomepageSectionOut(BaseModel):
    id: str
    section_key: str
    title: str
    description: str | None
    image: MediaRef | None
    cta_text: str | None
    cta_url: str | None
    is_active: bool
    display_order: int
    updated_at: datetime

    model_config = {"from_attributes": True}


class HomepageSectionCreate(BaseModel):
    section_key: str
    title: str
    description: str | None = None
    image_id: str | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool = True
    display_order: int = 1


class HomepageSectionUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    image_id: str | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool | None = None
    display_order: int | None = None


# ---------------------------------------------------------------------------
# Product Categories
# ---------------------------------------------------------------------------

class ProductCategoryOut(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class ProductCategoryCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    display_order: int = 1
    is_active: bool = True


class ProductCategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


# ---------------------------------------------------------------------------
# Product Modules
# ---------------------------------------------------------------------------

class ProductModuleOut(BaseModel):
    id: str
    name: str
    description: str | None
    image: MediaRef | None
    display_order: int

    model_config = {"from_attributes": True}


class ProductModuleCreate(BaseModel):
    name: str
    description: str | None = None
    image_id: str | None = None
    display_order: int = 1


class ProductModuleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image_id: str | None = None
    display_order: int | None = None


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------

class ProductListOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    hero_image: MediaRef | None
    category: ProductCategoryOut | None
    is_active: bool
    is_featured: bool
    display_order: int

    model_config = {"from_attributes": True}


class ProductDetailOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    description: str | None
    hero_image: MediaRef | None
    hero_video_url: str | None
    category: ProductCategoryOut | None
    features: list
    benefits: list
    use_cases: list
    modules: list[ProductModuleOut]
    gallery: list[dict]
    cta_text: str | None
    cta_url: str | None
    is_active: bool
    is_featured: bool
    display_order: int
    meta_title: str | None
    meta_description: str | None
    og_image: MediaRef | None

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    category_id: str | None = None
    name: str
    slug: str
    short_description: str | None = None
    description: str | None = None
    hero_image_id: str | None = None
    hero_video_url: str | None = None
    features: list = []
    benefits: list = []
    use_cases: list = []
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool = True
    is_featured: bool = False
    display_order: int = 1
    meta_title: str | None = None
    meta_description: str | None = None
    og_image_id: str | None = None


class ProductUpdate(BaseModel):
    category_id: str | None = None
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    hero_image_id: str | None = None
    hero_video_url: str | None = None
    features: list | None = None
    benefits: list | None = None
    use_cases: list | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    display_order: int | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    og_image_id: str | None = None


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

class ServiceListOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    icon: str | None
    image: MediaRef | None
    is_active: bool
    is_featured: bool
    display_order: int

    model_config = {"from_attributes": True}


class ServiceDetailOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    description: str | None
    icon: str | None
    image: MediaRef | None
    features: list
    cta_text: str | None
    cta_url: str | None
    is_active: bool
    is_featured: bool
    display_order: int
    meta_title: str | None
    meta_description: str | None
    og_image: MediaRef | None

    model_config = {"from_attributes": True}


class ServiceCreate(BaseModel):
    name: str
    slug: str
    short_description: str | None = None
    description: str | None = None
    icon: str | None = None
    image_id: str | None = None
    features: list = []
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool = True
    is_featured: bool = False
    display_order: int = 1
    meta_title: str | None = None
    meta_description: str | None = None
    og_image_id: str | None = None


class ServiceUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    icon: str | None = None
    image_id: str | None = None
    features: list | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    display_order: int | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    og_image_id: str | None = None


# ---------------------------------------------------------------------------
# Industries
# ---------------------------------------------------------------------------

class IndustryListOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    image: MediaRef | None
    is_active: bool
    display_order: int

    model_config = {"from_attributes": True}


class IndustryDetailOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    description: str | None
    image: MediaRef | None
    cta_text: str | None
    cta_url: str | None
    is_active: bool
    display_order: int
    meta_title: str | None
    meta_description: str | None
    og_image: MediaRef | None
    related_products: list[ProductListOut] = []

    model_config = {"from_attributes": True}


class IndustryCreate(BaseModel):
    name: str
    slug: str
    short_description: str | None = None
    description: str | None = None
    image_id: str | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool = True
    display_order: int = 1
    meta_title: str | None = None
    meta_description: str | None = None
    og_image_id: str | None = None


class IndustryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    image_id: str | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool | None = None
    display_order: int | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    og_image_id: str | None = None


# ---------------------------------------------------------------------------
# About
# ---------------------------------------------------------------------------

class AboutContentOut(BaseModel):
    id: str
    company_name: str
    tagline: str | None
    overview: str | None
    founder_name: str | None
    founder_title: str | None
    founder_message: str | None
    founded_year: int | None
    mission: str | None
    vision: str | None
    future_vision: str | None
    values: str | None
    commitment_items: list
    why_choose_items: list
    hero_image: MediaRef | None
    meta_title: str | None
    meta_description: str | None
    updated_at: datetime

    model_config = {"from_attributes": True}


class AboutContentUpdate(BaseModel):
    company_name: str | None = None
    tagline: str | None = None
    overview: str | None = None
    founder_name: str | None = None
    founder_title: str | None = None
    founder_message: str | None = None
    founded_year: int | None = None
    mission: str | None = None
    vision: str | None = None
    future_vision: str | None = None
    values: str | None = None
    commitment_items: list | None = None
    why_choose_items: list | None = None
    hero_image_id: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None


# ---------------------------------------------------------------------------
# Training Programs
# ---------------------------------------------------------------------------

class TrainingListOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    image: MediaRef | None
    duration: str | None
    is_active: bool
    display_order: int

    model_config = {"from_attributes": True}


class TrainingDetailOut(BaseModel):
    id: str
    name: str
    slug: str
    short_description: str | None
    description: str | None
    image: MediaRef | None
    duration: str | None
    features: list
    who_can_apply: list
    what_you_gain: list
    cta_text: str | None
    cta_url: str | None
    is_active: bool
    display_order: int
    meta_title: str | None
    meta_description: str | None

    model_config = {"from_attributes": True}


class TrainingCreate(BaseModel):
    name: str
    slug: str
    short_description: str | None = None
    description: str | None = None
    image_id: str | None = None
    duration: str | None = None
    features: list = []
    who_can_apply: list = []
    what_you_gain: list = []
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool = True
    display_order: int = 1
    meta_title: str | None = None
    meta_description: str | None = None


class TrainingUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    image_id: str | None = None
    duration: str | None = None
    features: list | None = None
    who_can_apply: list | None = None
    what_you_gain: list | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    is_active: bool | None = None
    display_order: int | None = None
    meta_title: str | None = None
    meta_description: str | None = None


# ---------------------------------------------------------------------------
# Contact
# ---------------------------------------------------------------------------

class ContactSettingOut(BaseModel):
    primary_email: str | None
    hr_email: str | None
    primary_phone: str | None
    secondary_phone: str | None
    contact_form_enabled: bool
    contact_form_recipient: str | None
    business_hours: str | None

    model_config = {"from_attributes": True}


class ContactSettingUpdate(BaseModel):
    primary_email: str | None = None
    hr_email: str | None = None
    primary_phone: str | None = None
    secondary_phone: str | None = None
    contact_form_enabled: bool | None = None
    contact_form_recipient: str | None = None
    business_hours: str | None = None


class BranchOut(BaseModel):
    id: str
    name: str
    address: str | None
    phone: str | None
    email: str | None
    is_primary: bool
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class BranchCreate(BaseModel):
    name: str
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    is_primary: bool = False
    display_order: int = 1
    is_active: bool = True


class BranchUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    is_primary: bool | None = None
    display_order: int | None = None
    is_active: bool | None = None


class SocialLinkOut(BaseModel):
    id: str
    platform: str
    url: str
    icon: str | None
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class SocialLinkCreate(BaseModel):
    platform: str
    url: str = "#"
    icon: str | None = None
    display_order: int = 1
    is_active: bool = True


class SocialLinkUpdate(BaseModel):
    platform: str | None = None
    url: str | None = None
    icon: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class ContactFormSubmission(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str | None = None


# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------

class NavigationItemOut(BaseModel):
    id: str
    label: str
    url: str
    parent_id: str | None
    location: str
    display_order: int
    is_active: bool
    is_external: bool
    target: str
    children: list["NavigationItemOut"] = []

    model_config = {"from_attributes": True}


class NavigationItemCreate(BaseModel):
    label: str
    url: str
    parent_id: str | None = None
    location: str = "primary"
    display_order: int = 1
    is_active: bool = True
    is_external: bool = False
    target: str = "_self"


class NavigationItemUpdate(BaseModel):
    label: str | None = None
    url: str | None = None
    parent_id: str | None = None
    location: str | None = None
    display_order: int | None = None
    is_active: bool | None = None
    is_external: bool | None = None
    target: str | None = None


# ---------------------------------------------------------------------------
# FAQs
# ---------------------------------------------------------------------------

class FAQOut(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class FAQCreate(BaseModel):
    question: str
    answer: str
    category: str = "general"
    display_order: int = 1
    is_active: bool = True


class FAQUpdate(BaseModel):
    question: str | None = None
    answer: str | None = None
    category: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


# ---------------------------------------------------------------------------
# Media Assets
# ---------------------------------------------------------------------------

class MediaAssetOut(BaseModel):
    id: str
    filename: str
    storage_path: str
    alt_text: str | None
    media_type: str
    mime_type: str
    file_size: int
    width: int | None
    height: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Site Settings
# ---------------------------------------------------------------------------

class SiteSettingOut(BaseModel):
    key: str
    value: str | None

    model_config = {"from_attributes": True}


class SiteSettingUpdate(BaseModel):
    value: str | None


# ---------------------------------------------------------------------------
# Homepage Public Response
# ---------------------------------------------------------------------------

class HomePublicResponse(BaseModel):
    hero: HeroSectionOut | None
    popup: PopupOut | None
    sections: list[HomepageSectionOut]
    featured_products: list[ProductListOut]
    services: list[ServiceListOut]
    industries: list[IndustryListOut]
