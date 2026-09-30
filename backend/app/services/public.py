from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.content import ProductRepository, ProductCategoryRepository, ServiceRepository, IndustryRepository, TrainingRepository
from app.repositories.info import AboutRepository, ContactSettingRepository, BranchRepository, EnquiryRepository
from app.models import Enquiry

class NotFoundError(Exception):
    pass

class PublicContentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.product_repo = ProductRepository(db)
        self.category_repo = ProductCategoryRepository(db)
        self.service_repo = ServiceRepository(db)
        self.industry_repo = IndustryRepository(db)
        self.training_repo = TrainingRepository(db)
        self.about_repo = AboutRepository(db)
        self.contact_repo = ContactSettingRepository(db)
        self.branch_repo = BranchRepository(db)
        self.enquiry_repo = EnquiryRepository(db)
        
    async def get_categories(self):
        return await self.category_repo.list_published()
        
    async def get_products(self):
        return await self.product_repo.list_published()
        
    async def get_products_by_category(self, category_slug: str):
        cat = await self.category_repo.get_by_slug(category_slug)
        if not cat or not getattr(cat, 'is_active', True):
            raise NotFoundError("Category not found")
        return await self.product_repo.list_by_category(cat.id, published_only=True)
        
    async def get_product_by_slug(self, slug: str):
        product = await self.product_repo.get_by_slug(slug)
        if not product or not product.is_active:
            raise NotFoundError("Product not found")
        if product.category_id and not getattr(product, 'category', None):
            product.category = await self.category_repo.get_by_id(product.category_id)
        return product
        
    async def get_services(self):
        return await self.service_repo.list_published()
        
    async def get_service_by_slug(self, slug: str):
        service = await self.service_repo.get_by_slug(slug)
        if not service or not service.is_active:
            raise NotFoundError("Service not found")
        return service
        
    async def get_industries(self):
        return await self.industry_repo.list_published()
        
    async def get_industry_by_slug(self, slug: str):
        industry = await self.industry_repo.get_by_slug(slug)
        if not industry or not industry.is_active:
            raise NotFoundError("Industry not found")
        return industry
        
    async def get_trainings(self):
        return await self.training_repo.list_published()
        
    async def get_training_by_slug(self, slug: str):
        training = await self.training_repo.get_by_slug(slug)
        if not training or not training.is_active:
            raise NotFoundError("Training program not found")
        return training
        
    async def get_about(self):
        return await self.about_repo.get_active()
        
    async def get_contact(self):
        contact = await self.contact_repo.get_active()
        branches = await self.branch_repo.list_published()
        
        return {
            "primary_email": contact.primary_email if contact else None,
            "hr_email": contact.hr_email if contact else None,
            "primary_phone": contact.primary_phone if contact else None,
            "branches": branches
        }
        
    async def create_enquiry(self, data: dict):
        enquiry = Enquiry(**data)
        self.db.add(enquiry)
        await self.db.commit()
        return True
