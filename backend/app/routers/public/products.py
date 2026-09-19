import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import Product, ProductCategory, ProductModule, ProductImage
from app.schemas import ProductListOut, ProductDetailOut, ProductCategoryOut, PaginationMeta
from pydantic import BaseModel

router = APIRouter(prefix="/products", tags=["Public - Products"])


class ProductListResponse(BaseModel):
    data: list[ProductListOut]
    meta: PaginationMeta


@router.get("/categories", response_model=list[ProductCategoryOut])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ProductCategory)
        .where(ProductCategory.is_active == True)
        .order_by(ProductCategory.display_order)
    )
    return result.scalars().all()


@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    category: str | None = Query(None),
    featured: bool | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    filters = [Product.is_active == True, Product.deleted_at.is_(None)]
    if featured is not None:
        filters.append(Product.is_featured == featured)
    if category:
        cat_result = await db.execute(
            select(ProductCategory.id).where(ProductCategory.slug == category)
        )
        cat_id = cat_result.scalar_one_or_none()
        if cat_id:
            filters.append(Product.category_id == cat_id)

    count_result = await db.execute(
        select(func.count()).select_from(Product).where(*filters)
    )
    total = count_result.scalar_one()

    result = await db.execute(
        select(Product)
        .where(*filters)
        .options(selectinload(Product.hero_image), selectinload(Product.category))
        .order_by(Product.display_order)
        .offset((page - 1) * limit)
        .limit(limit)
    )
    products = result.scalars().all()

    return ProductListResponse(
        data=[ProductListOut.model_validate(p) for p in products],
        meta=PaginationMeta(
            total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 1
        ),
    )


@router.get("/{slug}", response_model=ProductDetailOut)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .where(Product.slug == slug, Product.is_active == True, Product.deleted_at.is_(None))
        .options(
            selectinload(Product.hero_image),
            selectinload(Product.og_image),
            selectinload(Product.category),
            selectinload(Product.modules).selectinload(ProductModule.image),
            selectinload(Product.gallery).selectinload(ProductImage.media),
        )
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    out = ProductDetailOut.model_validate(product)
    out.gallery = [
        {
            "id": g.id,
            "media": {
                "id": g.media.id,
                "filename": g.media.filename,
                "storage_path": g.media.storage_path,
                "alt_text": g.media.alt_text,
                "media_type": g.media.media_type,
                "width": g.media.width,
                "height": g.media.height,
            },
            "display_order": g.display_order,
        }
        for g in product.gallery
    ]
    return out
