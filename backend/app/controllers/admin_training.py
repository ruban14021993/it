from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.admin_training import AdminTrainingProgramService, NotFoundError, DuplicateSlugError, DependencyError
from app.schemas import TrainingCreate, TrainingUpdate

class AdminTrainingProgramController:
    def __init__(self, db: AsyncSession):
        self.service = AdminTrainingProgramService(db)

    async def list_all(self):
        return await self.service.list_all()

    async def get_by_id(self, id: str):
        try:
            return await self.service.get_by_id(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    async def create(self, data: TrainingCreate):
        try:
            return await self.service.create(data)
        except DuplicateSlugError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def update(self, id: str, data: TrainingUpdate):
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
