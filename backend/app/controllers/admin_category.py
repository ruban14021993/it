from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.admin_category import AdminProductCategoryService, NotFoundError, DuplicateSlugError, DependencyError
from app.schemas import ProductCategoryCreate, ProductCategoryUpdate

class AdminProductCategoryController:
    def __init__(self, db: AsyncSession):
        self.service = AdminProductCategoryService(db)

    async def list_all(self):
        return await self.service.list_all()

    async def get_by_id(self, id: str):
        try:
            return await self.service.get_by_id(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    async def create(self, data: ProductCategoryCreate):
        try:
            return await self.service.create(data)
        except DuplicateSlugError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def update(self, id: str, data: ProductCategoryUpdate):
        try:
            return await self.service.update(id, data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
        except DuplicateSlugError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def delete(self, id: str):
        try:
            await self.service.delete(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
        except DependencyError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
