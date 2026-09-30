from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.controllers.public import PublicController

router = APIRouter(prefix="/industries", tags=["Public - Industries"])

@router.get("")
async def get_industries(db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_industries()

@router.get("/{slug}")
async def get_industry(slug: str, db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_industry(slug)
