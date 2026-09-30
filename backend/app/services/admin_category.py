import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from app.repositories.admin_category import AdminProductCategoryRepository
from app.models import ProductCategory, Product
from app.schemas import ProductCategoryCreate, ProductCategoryUpdate

class DuplicateSlugError(Exception):
    pass

class NotFoundError(Exception):
    pass

class DependencyError(Exception):
    pass

def normalize_slug(slug: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', slug.lower()).strip('-')

class AdminProductCategoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminProductCategoryRepository(db)

    async def list_all(self):
        return await self.repo.list_all()

    async def get_by_id(self, id: str):
        obj = await self.repo.get_by_id(id)
        if not obj:
            raise NotFoundError()
        return obj

    async def create(self, data: ProductCategoryCreate):
        if getattr(data, 'slug', None):
            data.slug = normalize_slug(data.slug)
            existing = await self.repo.get_by_slug(data.slug)
            if existing:
                raise DuplicateSlugError(f"Slug '{data.slug}' already exists.")

        obj_data = data.model_dump(exclude_unset=True)
        obj = ProductCategory(**obj_data)
        
        try:
            return await self.repo.create(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateSlugError("Database integrity error. Slug may be a duplicate.")

    async def update(self, id: str, data: ProductCategoryUpdate):
        obj = await self.get_by_id(id)
        
        if getattr(data, 'slug', None):
            data.slug = normalize_slug(data.slug)
            existing = await self.repo.get_by_slug(data.slug)
            if existing and existing.id != obj.id:
                raise DuplicateSlugError(f"Slug '{data.slug}' is already used by another record.")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
            
        try:
            return await self.repo.update(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateSlugError("Database integrity error during update.")

    async def delete(self, id: str):
        obj = await self.get_by_id(id)
        
        # Manually check for dependents since the schema uses ON DELETE SET NULL
        result = await self.db.execute(select(Product).where(Product.category_id == id))
        if result.scalars().first() is not None:
            raise DependencyError("Cannot delete category because it has products referencing it.")

        try:
            await self.repo.delete(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DependencyError("Cannot delete this record because other records depend on it.")
