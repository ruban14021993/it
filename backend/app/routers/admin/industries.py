from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from app.database import get_db
from app.models import AdminUser, Industry, IndustryProduct, Product
from app.schemas import IndustryListOut, IndustryDetailOut, IndustryCreate, IndustryUpdate, ProductListOut
from app.core.deps import get_current_admin

router = APIRouter(prefix="/industries", tags=["Admin - Industries"])


@router.get("", response_model=list[IndustryListOut])
async def list_industries(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Industry)
        .where(Industry.deleted_at.is_(None))
        .options(selectinload(Industry.image))
        .order_by(Industry.display_order)
    )
    return result.scalars().all()


@router.post("", response_model=IndustryDetailOut, status_code=201)
async def create_industry(
    data: IndustryCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    industry = Industry(**data.model_dump())
    db.add(industry)
    await db.commit()
    await db.refresh(industry)
    out = IndustryDetailOut.model_validate(industry)
    out.related_products = []
    return out


@router.get("/{industry_id}", response_model=IndustryDetailOut)
async def get_industry(
    industry_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Industry)
        .where(Industry.id == industry_id, Industry.deleted_at.is_(None))
        .options(
            selectinload(Industry.image),
            selectinload(Industry.og_image),
            selectinload(Industry.product_links)
            .selectinload(IndustryProduct.product)
            .selectinload(Product.hero_image),
            selectinload(Industry.product_links)
            .selectinload(IndustryProduct.product)
            .selectinload(Product.category),
        )
    )
    industry = result.scalar_one_or_none()
    if not industry:
        raise HTTPException(status_code=404, detail="Industry not found")
    out = IndustryDetailOut.model_validate(industry)
    out.related_products = [
        ProductListOut.model_validate(link.product) for link in industry.product_links
    ]
    return out


@router.patch("/{industry_id}", response_model=IndustryDetailOut)
async def update_industry(
    industry_id: str,
    data: IndustryUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Industry)
        .where(Industry.id == industry_id, Industry.deleted_at.is_(None))
        .options(selectinload(Industry.image), selectinload(Industry.og_image))
    )
    industry = result.scalar_one_or_none()
    if not industry:
        raise HTTPException(status_code=404, detail="Industry not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(industry, field, value)
    await db.commit()
    await db.refresh(industry)
    out = IndustryDetailOut.model_validate(industry)
    out.related_products = []
    return out


@router.delete("/{industry_id}", status_code=204)
async def delete_industry(
    industry_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Industry).where(Industry.id == industry_id, Industry.deleted_at.is_(None))
    )
    industry = result.scalar_one_or_none()
    if not industry:
        raise HTTPException(status_code=404, detail="Industry not found")
    industry.deleted_at = datetime.now(timezone.utc)
    await db.commit()


@router.post("/{industry_id}/products/{product_id}", status_code=201)
async def add_product_to_industry(
    industry_id: str,
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    link = IndustryProduct(industry_id=industry_id, product_id=product_id)
    db.add(link)
    await db.commit()
    return {"message": "Product linked to industry"}


@router.delete("/{industry_id}/products/{product_id}", status_code=204)
async def remove_product_from_industry(
    industry_id: str,
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(IndustryProduct).where(
            IndustryProduct.industry_id == industry_id,
            IndustryProduct.product_id == product_id,
        )
    )
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    await db.delete(link)
    await db.commit()
