from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.controllers.public import PublicController

router = APIRouter(prefix="/contact", tags=["Public - Contact"])

@router.get("")
async def get_contact(db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_contact()
