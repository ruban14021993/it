from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.controllers.public import PublicController

router = APIRouter(prefix="/products", tags=["Public - Products"])

@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_categories()

@router.get("")
async def get_products(db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_products()

@router.get("/category/{category_slug}")
async def get_products_by_category(category_slug: str, db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_products_by_category(category_slug)

@router.get("/{slug}")
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_product(slug)
