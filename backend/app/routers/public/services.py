from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import Service
from app.schemas import ServiceListOut, ServiceDetailOut

router = APIRouter(prefix="/services", tags=["Public - Services"])


@router.get("", response_model=list[ServiceListOut])
async def get_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Service)
        .where(Service.is_active == True, Service.deleted_at.is_(None))
        .options(selectinload(Service.image))
        .order_by(Service.display_order)
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=ServiceDetailOut)
async def get_service(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Service)
        .where(Service.slug == slug, Service.is_active == True, Service.deleted_at.is_(None))
        .options(selectinload(Service.image), selectinload(Service.og_image))
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
