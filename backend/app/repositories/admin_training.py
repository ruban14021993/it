from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Sequence
from app.models import TrainingProgram

class AdminTrainingProgramRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _query(self):
        return select(TrainingProgram)

    async def list_all(self) -> Sequence[TrainingProgram]:
        stmt = self._query().order_by(TrainingProgram.display_order)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, id: str) -> TrainingProgram | None:
        stmt = self._query().where(TrainingProgram.id == id).execution_options(populate_existing=True)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> TrainingProgram | None:
        stmt = self._query().where(TrainingProgram.slug == slug).execution_options(populate_existing=True)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: TrainingProgram) -> TrainingProgram:
        self.db.add(obj)
        await self.db.commit()
        return await self.get_by_id(obj.id)

    async def update(self, obj: TrainingProgram) -> TrainingProgram:
        self.db.add(obj)
        await self.db.commit()
        return await self.get_by_id(obj.id)

    async def delete(self, obj: TrainingProgram) -> None:
        await self.db.delete(obj)
        await self.db.commit()
