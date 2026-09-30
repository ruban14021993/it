from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Sequence
from app.models import Industry

class AdminIndustryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _query(self):
        return select(Industry)

    async def list_all(self) -> Sequence[Industry]:
        stmt = self._query().order_by(Industry.display_order)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, id: str) -> Industry | None:
        stmt = self._query().where(Industry.id == id).execution_options(populate_existing=True)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Industry | None:
        stmt = self._query().where(Industry.slug == slug).execution_options(populate_existing=True)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: Industry) -> Industry:
        self.db.add(obj)
        await self.db.commit()
        return await self.get_by_id(obj.id)

    async def update(self, obj: Industry) -> Industry:
        self.db.add(obj)
        await self.db.commit()
        return await self.get_by_id(obj.id)

    async def delete(self, obj: Industry) -> None:
        await self.db.delete(obj)
        await self.db.commit()
