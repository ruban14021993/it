from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import AdminUser, HeroSection, Popup, HomepageSection
from app.schemas import (
    HeroSectionOut, HeroSectionUpdate,
    PopupOut, PopupCreate, PopupUpdate,
    HomepageSectionOut, HomepageSectionCreate, HomepageSectionUpdate,
)
from app.core.deps import get_current_admin

router = APIRouter(prefix="/homepage", tags=["Admin - Homepage"])


# --- HERO ---

@router.get("/hero", response_model=list[HeroSectionOut])
async def get_hero_sections(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(HeroSection)
        .options(selectinload(HeroSection.image))
        .order_by(HeroSection.display_order)
    )
    return result.scalars().all()


@router.patch("/hero/{hero_id}", response_model=HeroSectionOut)
async def update_hero(
    hero_id: str,
    data: HeroSectionUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(HeroSection).where(HeroSection.id == hero_id).options(selectinload(HeroSection.image))
    )
    hero = result.scalar_one_or_none()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(hero, field, value)
    await db.commit()
    await db.refresh(hero)
    return hero


# --- POPUP ---

@router.get("/popup", response_model=list[PopupOut])
async def get_popups(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(Popup).options(selectinload(Popup.image)))
    return result.scalars().all()


@router.post("/popup", response_model=PopupOut, status_code=201)
async def create_popup(
    data: PopupCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    popup = Popup(**data.model_dump())
    db.add(popup)
    await db.commit()
    await db.refresh(popup)
    return popup


@router.patch("/popup/{popup_id}", response_model=PopupOut)
async def update_popup(
    popup_id: str,
    data: PopupUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Popup).where(Popup.id == popup_id).options(selectinload(Popup.image))
    )
    popup = result.scalar_one_or_none()
    if not popup:
        raise HTTPException(status_code=404, detail="Popup not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(popup, field, value)
    await db.commit()
    await db.refresh(popup)
    return popup


# --- SECTIONS ---

@router.get("/sections", response_model=list[HomepageSectionOut])
async def get_sections(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(HomepageSection)
        .options(selectinload(HomepageSection.image))
        .order_by(HomepageSection.display_order)
    )
    return result.scalars().all()


@router.post("/sections", response_model=HomepageSectionOut, status_code=201)
async def create_section(
    data: HomepageSectionCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    section = HomepageSection(**data.model_dump())
    db.add(section)
    await db.commit()
    await db.refresh(section)
    return section


@router.patch("/sections/{section_id}", response_model=HomepageSectionOut)
async def update_section(
    section_id: str,
    data: HomepageSectionUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(HomepageSection)
        .where(HomepageSection.id == section_id)
        .options(selectinload(HomepageSection.image))
    )
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(section, field, value)
    await db.commit()
    await db.refresh(section)
    return section


@router.delete("/sections/{section_id}", status_code=204)
async def delete_section(
    section_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(HomepageSection).where(HomepageSection.id == section_id)
    )
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    await db.delete(section)
    await db.commit()
