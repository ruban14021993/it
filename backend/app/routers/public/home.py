from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from app.database import get_db
from app.models import HeroSection, Popup, HomepageSection, Product, Service, Industry
from app.schemas import (
    HomePublicResponse, HeroSectionOut, PopupOut, HomepageSectionOut,
    ProductListOut, ServiceListOut, IndustryListOut,
)

router = APIRouter(prefix="/home", tags=["Public - Home"])


@router.get("", response_model=HomePublicResponse)
async def get_home(db: AsyncSession = Depends(get_db)):
    now = datetime.now(timezone.utc)

    # Hero — first active record
    hero_result = await db.execute(
        select(HeroSection)
        .where(HeroSection.is_active == True)
        .options(selectinload(HeroSection.image))
        .order_by(HeroSection.display_order)
        .limit(1)
    )
    hero = hero_result.scalar_one_or_none()

    # Popup — active and within date window
    popup_result = await db.execute(
        select(Popup)
        .where(Popup.is_active == True)
        .options(selectinload(Popup.image))
        .limit(1)
    )
    popup = popup_result.scalar_one_or_none()
    if popup:
        if popup.starts_at and popup.starts_at > now:
            popup = None
        elif popup.ends_at and popup.ends_at < now:
            popup = None

    # Homepage sections
    sections_result = await db.execute(
        select(HomepageSection)
        .where(HomepageSection.is_active == True)
        .options(selectinload(HomepageSection.image))
        .order_by(HomepageSection.display_order)
    )
    sections = sections_result.scalars().all()

    # Featured products (max 6)
    products_result = await db.execute(
        select(Product)
        .where(Product.is_active == True, Product.is_featured == True, Product.deleted_at.is_(None))
        .options(selectinload(Product.hero_image), selectinload(Product.category))
        .order_by(Product.display_order)
        .limit(6)
    )
    featured_products = products_result.scalars().all()

    # Services (max 8)
    services_result = await db.execute(
        select(Service)
        .where(Service.is_active == True, Service.deleted_at.is_(None))
        .options(selectinload(Service.image))
        .order_by(Service.display_order)
        .limit(8)
    )
    services = services_result.scalars().all()

    # Industries (all active)
    industries_result = await db.execute(
        select(Industry)
        .where(Industry.is_active == True, Industry.deleted_at.is_(None))
        .options(selectinload(Industry.image))
        .order_by(Industry.display_order)
    )
    industries = industries_result.scalars().all()

    return HomePublicResponse(
        hero=HeroSectionOut.model_validate(hero) if hero else None,
        popup=PopupOut.model_validate(popup) if popup else None,
        sections=[HomepageSectionOut.model_validate(s) for s in sections],
        featured_products=[ProductListOut.model_validate(p) for p in featured_products],
        services=[ServiceListOut.model_validate(s) for s in services],
        industries=[IndustryListOut.model_validate(i) for i in industries],
    )
