from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import Industry, IndustryProduct, Product
from app.schemas import IndustryListOut, IndustryDetailOut, ProductListOut

router = APIRouter(prefix="/industries", tags=["Public - Industries"])


@router.get("", response_model=list[IndustryListOut])
async def get_industries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Industry)
        .where(Industry.is_active == True, Industry.deleted_at.is_(None))
        .options(selectinload(Industry.image))
        .order_by(Industry.display_order)
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=IndustryDetailOut)
async def get_industry(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Industry)
        .where(Industry.slug == slug, Industry.is_active == True, Industry.deleted_at.is_(None))
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
        ProductListOut.model_validate(link.product)
        for link in industry.product_links
        if link.product.is_active and link.product.deleted_at is None
    ]
    return out
