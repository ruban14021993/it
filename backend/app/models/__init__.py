import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, Integer, Text, DateTime, ForeignKey, BigInteger, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


def new_uuid():
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Roles & Admin Users
# ---------------------------------------------------------------------------

class Role(Base):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    permissions: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    users: Mapped[list["AdminUser"]] = relationship("AdminUser", back_populates="role")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(300), nullable=False)
    role_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("roles.id"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    role: Mapped["Role"] = relationship("Role", back_populates="users")


# ---------------------------------------------------------------------------
# Site Settings (key-value)
# ---------------------------------------------------------------------------

class SiteSetting(Base):
    __tablename__ = "site_settings"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    value: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


# ---------------------------------------------------------------------------
# Media Assets
# ---------------------------------------------------------------------------

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    filename: Mapped[str] = mapped_column(String(300), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[str | None] = mapped_column(String(300), nullable=True)
    media_type: Mapped[str] = mapped_column(String(30), nullable=False)  # image | video | document
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(BigInteger, default=0)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


# ---------------------------------------------------------------------------
# Homepage — Hero
# ---------------------------------------------------------------------------

class HeroSection(Base):
    __tablename__ = "hero_sections"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    eyebrow: Mapped[str | None] = mapped_column(String(120), nullable=True)
    heading: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    primary_cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    primary_cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    secondary_cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    secondary_cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[image_id])


# ---------------------------------------------------------------------------
# Homepage — Popup
# ---------------------------------------------------------------------------

class Popup(Base):
    __tablename__ = "popups"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[image_id])


# ---------------------------------------------------------------------------
# Homepage — Sections
# ---------------------------------------------------------------------------

class HomepageSection(Base):
    __tablename__ = "homepage_sections"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    section_key: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[image_id])


# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------

class NavigationItem(Base):
    __tablename__ = "navigation_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    parent_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("navigation_items.id", ondelete="SET NULL"), nullable=True)
    location: Mapped[str] = mapped_column(String(30), nullable=False, default="primary")
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_external: Mapped[bool] = mapped_column(Boolean, default=False)
    target: Mapped[str] = mapped_column(String(20), default="_self")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    children: Mapped[list["NavigationItem"]] = relationship("NavigationItem", back_populates="parent", foreign_keys=[parent_id])
    parent: Mapped["NavigationItem | None"] = relationship("NavigationItem", back_populates="children", remote_side=[id], foreign_keys=[parent_id])


# ---------------------------------------------------------------------------
# Product Categories
# ---------------------------------------------------------------------------

class ProductCategory(Base):
    __tablename__ = "product_categories"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    products: Mapped[list["Product"]] = relationship("Product", back_populates="category")


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------

class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    category_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("product_categories.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    short_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    hero_image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    hero_video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    features: Mapped[list] = mapped_column(JSONB, default=list)
    benefits: Mapped[list] = mapped_column(JSONB, default=list)
    use_cases: Mapped[list] = mapped_column(JSONB, default=list)
    cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    meta_title: Mapped[str | None] = mapped_column(String(160), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(String(320), nullable=True)
    og_image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    category: Mapped["ProductCategory | None"] = relationship("ProductCategory", back_populates="products")
    hero_image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[hero_image_id])
    og_image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[og_image_id])
    modules: Mapped[list["ProductModule"]] = relationship("ProductModule", back_populates="product", cascade="all, delete-orphan", order_by="ProductModule.display_order")
    gallery: Mapped[list["ProductImage"]] = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.display_order")
    industry_links: Mapped[list["IndustryProduct"]] = relationship("IndustryProduct", back_populates="product")


class ProductModule(Base):
    __tablename__ = "product_modules"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    product_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    product: Mapped["Product"] = relationship("Product", back_populates="modules")
    image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[image_id])


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    product_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    media_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="CASCADE"), nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    product: Mapped["Product"] = relationship("Product", back_populates="gallery")
    media: Mapped["MediaAsset"] = relationship("MediaAsset", foreign_keys=[media_id])


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

class Service(Base):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    short_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)
    image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    features: Mapped[list] = mapped_column(JSONB, default=list)
    cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    meta_title: Mapped[str | None] = mapped_column(String(160), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(String(320), nullable=True)
    og_image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[image_id])
    og_image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[og_image_id])


# ---------------------------------------------------------------------------
# Industries
# ---------------------------------------------------------------------------

class Industry(Base):
    __tablename__ = "industries"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    short_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    meta_title: Mapped[str | None] = mapped_column(String(160), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(String(320), nullable=True)
    og_image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[image_id])
    og_image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[og_image_id])
    product_links: Mapped[list["IndustryProduct"]] = relationship("IndustryProduct", back_populates="industry")


class IndustryProduct(Base):
    __tablename__ = "industry_products"
    __table_args__ = (UniqueConstraint("industry_id", "product_id"),)

    industry_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("industries.id", ondelete="CASCADE"), primary_key=True)
    product_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)

    industry: Mapped["Industry"] = relationship("Industry", back_populates="product_links")
    product: Mapped["Product"] = relationship("Product", back_populates="industry_links")


# ---------------------------------------------------------------------------
# About
# ---------------------------------------------------------------------------

class AboutContent(Base):
    __tablename__ = "about_content"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    company_name: Mapped[str] = mapped_column(String(200), default="InfinityMind Tech Pvt. Ltd.")
    tagline: Mapped[str | None] = mapped_column(String(300), nullable=True)
    overview: Mapped[str | None] = mapped_column(Text, nullable=True)
    founder_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    founder_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    founder_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    founded_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    mission: Mapped[str | None] = mapped_column(Text, nullable=True)
    vision: Mapped[str | None] = mapped_column(Text, nullable=True)
    future_vision: Mapped[str | None] = mapped_column(Text, nullable=True)
    values: Mapped[str | None] = mapped_column(Text, nullable=True)
    commitment_items: Mapped[list] = mapped_column(JSONB, default=list)
    why_choose_items: Mapped[list] = mapped_column(JSONB, default=list)
    hero_image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    meta_title: Mapped[str | None] = mapped_column(String(160), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(String(320), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    hero_image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[hero_image_id])


# ---------------------------------------------------------------------------
# Training Programs
# ---------------------------------------------------------------------------

class TrainingProgram(Base):
    __tablename__ = "training_programs"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    short_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    duration: Mapped[str | None] = mapped_column(String(100), nullable=True)
    features: Mapped[list] = mapped_column(JSONB, default=list)
    who_can_apply: Mapped[list] = mapped_column(JSONB, default=list)
    what_you_gain: Mapped[list] = mapped_column(JSONB, default=list)
    cta_text: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    meta_title: Mapped[str | None] = mapped_column(String(160), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(String(320), nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    image: Mapped["MediaAsset | None"] = relationship("MediaAsset", foreign_keys=[image_id])


# ---------------------------------------------------------------------------
# Contact Settings
# ---------------------------------------------------------------------------

class ContactSetting(Base):
    __tablename__ = "contact_settings"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    primary_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    hr_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    primary_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    secondary_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    contact_form_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    contact_form_recipient: Mapped[str | None] = mapped_column(String(200), nullable=True)
    business_hours: Mapped[str | None] = mapped_column(String(200), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class Branch(Base):
    __tablename__ = "branches"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class SocialLink(Base):
    __tablename__ = "social_links"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    platform: Mapped[str] = mapped_column(String(80), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False, default="#")
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


# ---------------------------------------------------------------------------
# FAQs
# ---------------------------------------------------------------------------

class FAQ(Base):
    __tablename__ = "faqs"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(80), default="general")
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
