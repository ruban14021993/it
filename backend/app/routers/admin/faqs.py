from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import AdminUser, FAQ
from app.schemas import FAQOut, FAQCreate, FAQUpdate
from app.core.deps import get_current_admin

router = APIRouter(prefix="/faqs", tags=["Admin - FAQs"])


@router.get("", response_model=list[FAQOut])
async def list_faqs(
    category: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    filters = []
    if category:
        filters.append(FAQ.category == category)
    result = await db.execute(select(FAQ).where(*filters).order_by(FAQ.display_order))
    return result.scalars().all()


@router.post("", response_model=FAQOut, status_code=201)
async def create_faq(
    data: FAQCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    faq = FAQ(**data.model_dump())
    db.add(faq)
    await db.commit()
    await db.refresh(faq)
    return faq


@router.patch("/{faq_id}", response_model=FAQOut)
async def update_faq(
    faq_id: str,
    data: FAQUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(faq, field, value)
    await db.commit()
    await db.refresh(faq)
    return faq


@router.delete("/{faq_id}", status_code=204)
async def delete_faq(
    faq_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    await db.delete(faq)
    await db.commit()
