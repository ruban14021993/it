from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import TrainingProgram
from app.schemas import TrainingListOut, TrainingDetailOut

router = APIRouter(prefix="/training", tags=["Public - Training"])


@router.get("", response_model=list[TrainingListOut])
async def get_training_programs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TrainingProgram)
        .where(TrainingProgram.is_active == True, TrainingProgram.deleted_at.is_(None))
        .options(selectinload(TrainingProgram.image))
        .order_by(TrainingProgram.display_order)
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=TrainingDetailOut)
async def get_training_program(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TrainingProgram)
        .where(
            TrainingProgram.slug == slug,
            TrainingProgram.is_active == True,
            TrainingProgram.deleted_at.is_(None),
        )
        .options(selectinload(TrainingProgram.image))
    )
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Training program not found")
    return program
