from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.admin_product import AdminProductService, NotFoundError, DuplicateSlugError, DependencyError, InvalidCategoryError
from app.schemas import ProductCreate, ProductUpdate

class AdminProductController:
    def __init__(self, db: AsyncSession):
        self.service = AdminProductService(db)

    async def list_all(self):
        return await self.service.list_all()

    async def get_by_id(self, id: str):
        try:
            return await self.service.get_by_id(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    async def create(self, data: ProductCreate):
        try:
            return await self.service.create(data)
        except InvalidCategoryError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
        except DuplicateSlugError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def update(self, id: str, data: ProductUpdate):
        try:
            return await self.service.update(id, data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
        except InvalidCategoryError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
        except DuplicateSlugError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def delete(self, id: str):
        try:
            await self.service.delete(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
        except DependencyError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
