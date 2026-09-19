from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import AdminUser, SiteSetting
from app.schemas import SiteSettingOut, SiteSettingUpdate
from app.core.deps import get_current_admin

router = APIRouter(prefix="/settings", tags=["Admin - Settings"])


@router.get("", response_model=list[SiteSettingOut])
async def list_settings(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(SiteSetting).order_by(SiteSetting.key))
    return result.scalars().all()


@router.patch("/{key}", response_model=SiteSettingOut)
async def update_setting(
    key: str,
    data: SiteSettingUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(SiteSetting).where(SiteSetting.key == key))
    setting = result.scalar_one_or_none()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting '{key}' not found")
    setting.value = data.value
    await db.commit()
    await db.refresh(setting)
    return setting
