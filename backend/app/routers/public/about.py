from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import AboutContent
from app.schemas import AboutContentOut

router = APIRouter(prefix="/about", tags=["Public - About"])


@router.get("", response_model=AboutContentOut)
async def get_about(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AboutContent)
        .options(selectinload(AboutContent.hero_image))
        .limit(1)
    )
    about = result.scalar_one_or_none()
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    return about
