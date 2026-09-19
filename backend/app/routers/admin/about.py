from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import AdminUser, AboutContent
from app.schemas import AboutContentOut, AboutContentUpdate
from app.core.deps import get_current_admin

router = APIRouter(prefix="/about", tags=["Admin - About"])


@router.get("", response_model=AboutContentOut)
async def get_about(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(AboutContent).options(selectinload(AboutContent.hero_image)).limit(1)
    )
    about = result.scalar_one_or_none()
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    return about


@router.patch("", response_model=AboutContentOut)
async def update_about(
    data: AboutContentUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(AboutContent).options(selectinload(AboutContent.hero_image)).limit(1)
    )
    about = result.scalar_one_or_none()
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(about, field, value)
    await db.commit()
    await db.refresh(about)
    return about
