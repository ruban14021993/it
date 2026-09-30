from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.public import PublicContentService, NotFoundError
from app.schemas.public import (
    CategoryPublic, ProductPublic, ServicePublic, IndustryPublic, 
    TrainingPublic, AboutPublic, ContactPublic, EnquiryCreate, SuccessResponse
)

class PublicController:
    def __init__(self, db: AsyncSession):
        self.service = PublicContentService(db)
        
    async def get_categories(self):
        items = await self.service.get_categories()
        return {"items": [CategoryPublic.model_validate(item) for item in items]}
        
    async def get_products(self):
        items = await self.service.get_products()
        return {"items": [ProductPublic.model_validate(item) for item in items]}
        
    async def get_products_by_category(self, slug: str):
        try:
            items = await self.service.get_products_by_category(slug)
            return {"items": [ProductPublic.model_validate(item) for item in items]}
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    async def get_product(self, slug: str):
        try:
            item = await self.service.get_product_by_slug(slug)
            return {"item": ProductPublic.model_validate(item)}
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    async def get_services(self):
        items = await self.service.get_services()
        return {"items": [ServicePublic.model_validate(item) for item in items]}
        
    async def get_service(self, slug: str):
        try:
            item = await self.service.get_service_by_slug(slug)
            return {"item": ServicePublic.model_validate(item)}
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    async def get_industries(self):
        items = await self.service.get_industries()
        return {"items": [IndustryPublic.model_validate(item) for item in items]}
        
    async def get_industry(self, slug: str):
        try:
            item = await self.service.get_industry_by_slug(slug)
            return {"item": IndustryPublic.model_validate(item)}
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    async def get_trainings(self):
        items = await self.service.get_trainings()
        return {"items": [TrainingPublic.model_validate(item) for item in items]}
        
    async def get_training(self, slug: str):
        try:
            item = await self.service.get_training_by_slug(slug)
            return {"item": TrainingPublic.model_validate(item)}
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    async def get_about(self):
        item = await self.service.get_about()
        if not item:
            raise HTTPException(status_code=404, detail="About content not found")
        return {"item": AboutPublic.model_validate(item)}
        
    async def get_contact(self):
        item = await self.service.get_contact()
        return {"item": ContactPublic.model_validate(item)}
        
    async def submit_enquiry(self, enquiry_in: EnquiryCreate):
        await self.service.create_enquiry(enquiry_in.model_dump())
        return SuccessResponse(message="Your enquiry has been submitted successfully.")
