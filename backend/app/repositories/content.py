from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Sequence

from app.models import ProductCategory, Product, ProductModule, ProductImage, Service, Industry, TrainingProgram
from app.repositories.base import BaseRepository

class ProductCategoryRepository(BaseRepository[ProductCategory]):
    def __init__(self, session: AsyncSession):
        super().__init__(ProductCategory, session)


class ProductRepository(BaseRepository[Product]):
    def __init__(self, session: AsyncSession):
        super().__init__(Product, session)

    async def list_published(self) -> Sequence[Product]:
        stmt = select(Product).where(Product.is_active == True).options(selectinload(Product.category), selectinload(Product.hero_image), selectinload(Product.og_image), selectinload(Product.modules).selectinload(ProductModule.image), selectinload(Product.gallery).selectinload(ProductImage.media)).order_by(Product.display_order)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_slug(self, slug: str) -> Product | None:
        stmt = select(Product).where(Product.slug == slug).options(selectinload(Product.category), selectinload(Product.hero_image), selectinload(Product.og_image), selectinload(Product.modules).selectinload(ProductModule.image), selectinload(Product.gallery).selectinload(ProductImage.media))
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_category(self, category_id: str, published_only: bool = True) -> Sequence[Product]:
        stmt = select(Product).where(Product.category_id == category_id).options(selectinload(Product.category), selectinload(Product.hero_image), selectinload(Product.og_image), selectinload(Product.modules).selectinload(ProductModule.image), selectinload(Product.gallery).selectinload(ProductImage.media))
        if published_only:
            stmt = stmt.where(Product.is_active == True)
        stmt = stmt.order_by(Product.display_order)
        result = await self.session.execute(stmt)
        return result.scalars().all()


class ServiceRepository(BaseRepository[Service]):
    def __init__(self, session: AsyncSession):
        super().__init__(Service, session)


class IndustryRepository(BaseRepository[Industry]):
    def __init__(self, session: AsyncSession):
        super().__init__(Industry, session)


class TrainingRepository(BaseRepository[TrainingProgram]):
    def __init__(self, session: AsyncSession):
        super().__init__(TrainingProgram, session)


