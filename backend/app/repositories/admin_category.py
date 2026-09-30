from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence
from app.models import ProductCategory

class AdminProductCategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_all(self) -> Sequence[ProductCategory]:
        stmt = select(ProductCategory)
        if hasattr(ProductCategory, 'display_order'):
            stmt = stmt.order_by(ProductCategory.display_order)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, id: str) -> ProductCategory | None:
        return await self.db.get(ProductCategory, id)

    async def get_by_slug(self, slug: str) -> ProductCategory | None:
        stmt = select(ProductCategory).where(ProductCategory.slug == slug)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: ProductCategory) -> ProductCategory:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: ProductCategory) -> ProductCategory:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete(self, obj: ProductCategory) -> None:
        await self.db.delete(obj)
        await self.db.commit()
