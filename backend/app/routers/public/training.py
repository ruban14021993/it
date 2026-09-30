from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.controllers.public import PublicController

router = APIRouter(prefix="/training", tags=["Public - Training"])

@router.get("")
async def get_trainings(db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_trainings()

@router.get("/{slug}")
async def get_training(slug: str, db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_training(slug)
