import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.repositories.admin_product import AdminProductRepository
from app.repositories.admin_category import AdminProductCategoryRepository
from app.models import Product
from app.schemas import ProductCreate, ProductUpdate

class DuplicateSlugError(Exception):
    pass

class NotFoundError(Exception):
    pass

class DependencyError(Exception):
    pass

class InvalidCategoryError(Exception):
    pass

def normalize_slug(slug: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', slug.lower()).strip('-')

class AdminProductService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminProductRepository(db)
        self.cat_repo = AdminProductCategoryRepository(db)

    async def list_all(self):
        return await self.repo.list_all()

    async def get_by_id(self, id: str):
        obj = await self.repo.get_by_id(id)
        if not obj:
            raise NotFoundError()
        return obj

    async def create(self, data: ProductCreate):
        if data.category_id:
            cat = await self.cat_repo.get_by_id(data.category_id)
            if not cat:
                raise InvalidCategoryError("The provided category_id does not exist.")

        if getattr(data, 'slug', None):
            data.slug = normalize_slug(data.slug)
            existing = await self.repo.get_by_slug(data.slug)
            if existing:
                raise DuplicateSlugError(f"Slug '{data.slug}' already exists.")

        obj_data = data.model_dump(exclude_unset=True)
        obj = Product(**obj_data)
        
        try:
            return await self.repo.create(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateSlugError("Database integrity error. Slug may be a duplicate.")

    async def update(self, id: str, data: ProductUpdate):
        obj = await self.get_by_id(id)
        
        if data.category_id is not None:
            cat = await self.cat_repo.get_by_id(data.category_id)
            if not cat:
                raise InvalidCategoryError("The provided category_id does not exist.")
        
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
        try:
            await self.repo.delete(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DependencyError("Cannot delete this record because other records depend on it.")
