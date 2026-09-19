from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import AdminUser, ContactSetting, Branch, SocialLink
from app.schemas import (
    ContactSettingOut, ContactSettingUpdate,
    BranchOut, BranchCreate, BranchUpdate,
    SocialLinkOut, SocialLinkCreate, SocialLinkUpdate,
)
from app.core.deps import get_current_admin

router = APIRouter(prefix="/contact", tags=["Admin - Contact"])


# --- SETTINGS ---

@router.get("/settings", response_model=ContactSettingOut)
async def get_settings(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(ContactSetting).limit(1))
    settings = result.scalar_one_or_none()
    if not settings:
        raise HTTPException(status_code=404, detail="Contact settings not found")
    return settings


@router.patch("/settings", response_model=ContactSettingOut)
async def update_settings(
    data: ContactSettingUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(ContactSetting).limit(1))
    settings = result.scalar_one_or_none()
    if not settings:
        raise HTTPException(status_code=404, detail="Contact settings not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(settings, field, value)
    await db.commit()
    await db.refresh(settings)
    return settings


# --- BRANCHES ---

@router.get("/branches", response_model=list[BranchOut])
async def list_branches(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(Branch).order_by(Branch.display_order))
    return result.scalars().all()


@router.post("/branches", response_model=BranchOut, status_code=201)
async def create_branch(
    data: BranchCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    branch = Branch(**data.model_dump())
    db.add(branch)
    await db.commit()
    await db.refresh(branch)
    return branch


@router.patch("/branches/{branch_id}", response_model=BranchOut)
async def update_branch(
    branch_id: str,
    data: BranchUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(Branch).where(Branch.id == branch_id))
    branch = result.scalar_one_or_none()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(branch, field, value)
    await db.commit()
    await db.refresh(branch)
    return branch


@router.delete("/branches/{branch_id}", status_code=204)
async def delete_branch(
    branch_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(Branch).where(Branch.id == branch_id))
    branch = result.scalar_one_or_none()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    await db.delete(branch)
    await db.commit()


# --- SOCIAL LINKS ---

@router.get("/social", response_model=list[SocialLinkOut])
async def list_social(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(SocialLink).order_by(SocialLink.display_order))
    return result.scalars().all()


@router.post("/social", response_model=SocialLinkOut, status_code=201)
async def create_social(
    data: SocialLinkCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    link = SocialLink(**data.model_dump())
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link


@router.patch("/social/{link_id}", response_model=SocialLinkOut)
async def update_social(
    link_id: str,
    data: SocialLinkUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(SocialLink).where(SocialLink.id == link_id))
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(link, field, value)
    await db.commit()
    await db.refresh(link)
    return link


@router.delete("/social/{link_id}", status_code=204)
async def delete_social(
    link_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(SocialLink).where(SocialLink.id == link_id))
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    await db.delete(link)
    await db.commit()
