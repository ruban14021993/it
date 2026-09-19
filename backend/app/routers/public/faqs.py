from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import FAQ
from app.schemas import FAQOut

router = APIRouter(prefix="/faqs", tags=["Public - FAQs"])


@router.get("", response_model=list[FAQOut])
async def get_faqs(
    category: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    filters = [FAQ.is_active == True]
    if category:
        filters.append(FAQ.category == category)
    result = await db.execute(
        select(FAQ).where(*filters).order_by(FAQ.display_order)
    )
    return result.scalars().all()
