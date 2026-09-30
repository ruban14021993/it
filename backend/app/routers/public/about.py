from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.controllers.public import PublicController

router = APIRouter(prefix="/about", tags=["Public - About"])

@router.get("")
async def get_about(db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.get_about()
