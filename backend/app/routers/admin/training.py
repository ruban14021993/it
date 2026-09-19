from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from app.database import get_db
from app.models import AdminUser, TrainingProgram
from app.schemas import TrainingListOut, TrainingDetailOut, TrainingCreate, TrainingUpdate
from app.core.deps import get_current_admin

router = APIRouter(prefix="/training", tags=["Admin - Training"])


@router.get("", response_model=list[TrainingListOut])
async def list_training(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(TrainingProgram)
        .where(TrainingProgram.deleted_at.is_(None))
        .options(selectinload(TrainingProgram.image))
        .order_by(TrainingProgram.display_order)
    )
    return result.scalars().all()


@router.post("", response_model=TrainingDetailOut, status_code=201)
async def create_training(
    data: TrainingCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    program = TrainingProgram(**data.model_dump())
    db.add(program)
    await db.commit()
    await db.refresh(program)
    return program


@router.get("/{program_id}", response_model=TrainingDetailOut)
async def get_training(
    program_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(TrainingProgram)
        .where(TrainingProgram.id == program_id, TrainingProgram.deleted_at.is_(None))
        .options(selectinload(TrainingProgram.image))
    )
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Training program not found")
    return program


@router.patch("/{program_id}", response_model=TrainingDetailOut)
async def update_training(
    program_id: str,
    data: TrainingUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(TrainingProgram)
        .where(TrainingProgram.id == program_id, TrainingProgram.deleted_at.is_(None))
        .options(selectinload(TrainingProgram.image))
    )
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Training program not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(program, field, value)
    await db.commit()
    await db.refresh(program)
    return program


@router.delete("/{program_id}", status_code=204)
async def delete_training(
    program_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(TrainingProgram).where(
            TrainingProgram.id == program_id, TrainingProgram.deleted_at.is_(None)
        )
    )
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Training program not found")
    program.deleted_at = datetime.now(timezone.utc)
    await db.commit()
