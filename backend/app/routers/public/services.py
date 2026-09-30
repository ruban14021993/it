from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.controllers.public import PublicController

router = APIRouter(prefix="/services", tags=["Public - Services"])

@router.get("")
async def get_services(db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_services()

@router.get("/{slug}")
async def get_service(slug: str, db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_service(slug)
