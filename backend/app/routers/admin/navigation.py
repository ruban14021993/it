from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import AdminUser, NavigationItem
from app.schemas import NavigationItemOut, NavigationItemCreate, NavigationItemUpdate
from app.core.deps import get_current_admin

router = APIRouter(prefix="/navigation", tags=["Admin - Navigation"])


@router.get("", response_model=list[NavigationItemOut])
async def list_nav(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(NavigationItem)
        .where(NavigationItem.parent_id.is_(None))
        .options(selectinload(NavigationItem.children))
        .order_by(NavigationItem.display_order)
    )
    return result.scalars().all()


@router.post("", response_model=NavigationItemOut, status_code=201)
async def create_nav(
    data: NavigationItemCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    item = NavigationItem(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=NavigationItemOut)
async def update_nav(
    item_id: str,
    data: NavigationItemUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(NavigationItem)
        .where(NavigationItem.id == item_id)
        .options(selectinload(NavigationItem.children))
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
async def delete_nav(
    item_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(NavigationItem).where(NavigationItem.id == item_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    await db.delete(item)
    await db.commit()
