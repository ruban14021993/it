from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.admin_content import (
    AdminHomepageService, AdminAboutService, AdminContactService, 
    AdminBranchService, AdminEnquiryService,
    NotFoundError, DuplicateNameError
)
from app.schemas.admin_content import (
    HomepageUpdate, AboutUpdate, ContactUpdate, BranchCreate, BranchUpdate, EnquiryUpdate
)

class AdminHomepageController:
    def __init__(self, db: AsyncSession):
        self.service = AdminHomepageService(db)

    async def get_content(self):
        try:
            return await self.service.get_content()
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Homepage configuration not found")

    async def update_content(self, data: HomepageUpdate):
        try:
            return await self.service.update_content(data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Homepage configuration not found")

class AdminAboutController:
    def __init__(self, db: AsyncSession):
        self.service = AdminAboutService(db)

    async def get_content(self):
        try:
            return await self.service.get_content()
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="About configuration not found")

    async def update_content(self, data: AboutUpdate):
        try:
            return await self.service.update_content(data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="About configuration not found")

class AdminContactController:
    def __init__(self, db: AsyncSession):
        self.service = AdminContactService(db)

    async def get_content(self):
        try:
            return await self.service.get_content()
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact configuration not found")

    async def update_content(self, data: ContactUpdate):
        try:
            return await self.service.update_content(data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact configuration not found")

class AdminBranchController:
    def __init__(self, db: AsyncSession):
        self.service = AdminBranchService(db)

    async def list_all(self):
        return await self.service.list_all()

    async def get_by_id(self, id: str):
        try:
            return await self.service.get_by_id(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")

    async def create(self, data: BranchCreate):
        try:
            return await self.service.create(data)
        except DuplicateNameError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def update(self, id: str, data: BranchUpdate):
        try:
            return await self.service.update(id, data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
        except DuplicateNameError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def delete(self, id: str):
        try:
            await self.service.delete(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")

class AdminEnquiryController:
    def __init__(self, db: AsyncSession):
        self.service = AdminEnquiryService(db)

    async def list_all(self):
        return await self.service.list_all()

    async def get_by_id(self, id: str):
        try:
            return await self.service.get_by_id(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")

    async def update(self, id: str, data: EnquiryUpdate):
        try:
            return await self.service.update(id, data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")

    async def delete(self, id: str):
        try:
            await self.service.delete(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")
