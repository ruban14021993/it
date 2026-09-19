import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from app.database import get_db
from app.models import AdminUser, Product, ProductCategory, ProductModule, ProductImage
from app.schemas import (
    ProductListOut, ProductDetailOut, ProductCreate, ProductUpdate,
    ProductCategoryOut, ProductCategoryCreate, ProductCategoryUpdate,
    ProductModuleOut, ProductModuleCreate, ProductModuleUpdate,
    PaginationMeta,
)
from app.core.deps import get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/products", tags=["Admin - Products"])


class ProductListResponse(BaseModel):
    data: list[ProductListOut]
    meta: PaginationMeta


# --- CATEGORIES ---

@router.get("/categories", response_model=list[ProductCategoryOut])
async def get_categories(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(ProductCategory).order_by(ProductCategory.display_order)
    )
    return result.scalars().all()


@router.post("/categories", response_model=ProductCategoryOut, status_code=201)
async def create_category(
    data: ProductCategoryCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    cat = ProductCategory(**data.model_dump())
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat


@router.patch("/categories/{cat_id}", response_model=ProductCategoryOut)
async def update_category(
    cat_id: str,
    data: ProductCategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(ProductCategory).where(ProductCategory.id == cat_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    await db.commit()
    await db.refresh(cat)
    return cat


@router.delete("/categories/{cat_id}", status_code=204)
async def delete_category(
    cat_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(ProductCategory).where(ProductCategory.id == cat_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(cat)
    await db.commit()


# --- PRODUCTS ---

@router.get("", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    is_active: bool | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    filters = [Product.deleted_at.is_(None)]
    if is_active is not None:
        filters.append(Product.is_active == is_active)
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
    return ProductListResponse(
        data=[ProductListOut.model_validate(p) for p in result.scalars().all()],
        meta=PaginationMeta(total=total, page=page, limit=limit, pages=math.ceil(total / limit)),
    )


@router.post("", response_model=ProductDetailOut, status_code=201)
async def create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    out = ProductDetailOut.model_validate(product)
    out.gallery = []
    return out


@router.get("/{product_id}", response_model=ProductDetailOut)
async def get_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Product)
        .where(Product.id == product_id, Product.deleted_at.is_(None))
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
        {"id": g.id, "media": {"id": g.media.id, "storage_path": g.media.storage_path, "filename": g.media.filename, "media_type": g.media.media_type, "alt_text": g.media.alt_text, "width": g.media.width, "height": g.media.height}, "display_order": g.display_order}
        for g in product.gallery
    ]
    return out


@router.patch("/{product_id}", response_model=ProductDetailOut)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Product)
        .where(Product.id == product_id, Product.deleted_at.is_(None))
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
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    out = ProductDetailOut.model_validate(product)
    out.gallery = [
        {"id": g.id, "media": {"id": g.media.id, "storage_path": g.media.storage_path, "filename": g.media.filename, "media_type": g.media.media_type, "alt_text": g.media.alt_text, "width": g.media.width, "height": g.media.height}, "display_order": g.display_order}
        for g in product.gallery
    ]
    return out


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.deleted_at.is_(None))
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.deleted_at = datetime.now(timezone.utc)
    await db.commit()


# --- MODULES ---

@router.get("/{product_id}/modules", response_model=list[ProductModuleOut])
async def get_modules(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(ProductModule)
        .where(ProductModule.product_id == product_id)
        .options(selectinload(ProductModule.image))
        .order_by(ProductModule.display_order)
    )
    return result.scalars().all()


@router.post("/{product_id}/modules", response_model=ProductModuleOut, status_code=201)
async def create_module(
    product_id: str,
    data: ProductModuleCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    module = ProductModule(product_id=product_id, **data.model_dump())
    db.add(module)
    await db.commit()
    await db.refresh(module)
    return module


@router.patch("/{product_id}/modules/{module_id}", response_model=ProductModuleOut)
async def update_module(
    product_id: str,
    module_id: str,
    data: ProductModuleUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(ProductModule)
        .where(ProductModule.id == module_id, ProductModule.product_id == product_id)
        .options(selectinload(ProductModule.image))
    )
    module = result.scalar_one_or_none()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(module, field, value)
    await db.commit()
    await db.refresh(module)
    return module


@router.delete("/{product_id}/modules/{module_id}", status_code=204)
async def delete_module(
    product_id: str,
    module_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(ProductModule).where(
            ProductModule.id == module_id, ProductModule.product_id == product_id
        )
    )
    module = result.scalar_one_or_none()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    await db.delete(module)
    await db.commit()
