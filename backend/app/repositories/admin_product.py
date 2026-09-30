from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Sequence
from app.models import Product, ProductImage

class AdminProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _query(self):
        return select(Product)

    async def list_all(self) -> Sequence[Product]:
        stmt = self._query().order_by(Product.display_order)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, id: str) -> Product | None:
        stmt = self._query().where(Product.id == id).execution_options(populate_existing=True)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Product | None:
        stmt = self._query().where(Product.slug == slug).execution_options(populate_existing=True)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: Product) -> Product:
        self.db.add(obj)
        await self.db.commit()
        return await self.get_by_id(obj.id)

    async def update(self, obj: Product) -> Product:
        self.db.add(obj)
        await self.db.commit()
        return await self.get_by_id(obj.id)

    async def delete(self, obj: Product) -> None:
        await self.db.delete(obj)
        await self.db.commit()
