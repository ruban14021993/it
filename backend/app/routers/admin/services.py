import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from app.database import get_db
from app.models import AdminUser, Service
from app.schemas import ServiceListOut, ServiceDetailOut, ServiceCreate, ServiceUpdate, PaginationMeta
from app.core.deps import get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/services", tags=["Admin - Services"])


class ServiceListResponse(BaseModel):
    data: list[ServiceListOut]
    meta: PaginationMeta


@router.get("", response_model=ServiceListResponse)
async def list_services(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    filters = [Service.deleted_at.is_(None)]
    total = (
        await db.execute(select(func.count()).select_from(Service).where(*filters))
    ).scalar_one()
    result = await db.execute(
        select(Service)
        .where(*filters)
        .options(selectinload(Service.image))
        .order_by(Service.display_order)
        .offset((page - 1) * limit)
        .limit(limit)
    )
    return ServiceListResponse(
        data=[ServiceListOut.model_validate(s) for s in result.scalars().all()],
        meta=PaginationMeta(
            total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 1
        ),
    )


@router.post("", response_model=ServiceDetailOut, status_code=201)
async def create_service(
    data: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    service = Service(**data.model_dump())
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service


@router.get("/{service_id}", response_model=ServiceDetailOut)
async def get_service(
    service_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Service)
        .where(Service.id == service_id, Service.deleted_at.is_(None))
        .options(selectinload(Service.image), selectinload(Service.og_image))
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.patch("/{service_id}", response_model=ServiceDetailOut)
async def update_service(
    service_id: str,
    data: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Service)
        .where(Service.id == service_id, Service.deleted_at.is_(None))
        .options(selectinload(Service.image), selectinload(Service.og_image))
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(service, field, value)
    await db.commit()
    await db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=204)
async def delete_service(
    service_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Service).where(Service.id == service_id, Service.deleted_at.is_(None))
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    service.deleted_at = datetime.now(timezone.utc)
    await db.commit()
