from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.repositories.admin_content import (
    AdminHomepageRepository, AdminAboutRepository, 
    AdminContactRepository, AdminBranchRepository, AdminEnquiryRepository
)
from app.models import HeroSection, AboutContent, ContactSetting, Branch, Enquiry
from app.schemas.admin_content import (
    HomepageUpdate, AboutUpdate, ContactUpdate, BranchCreate, BranchUpdate, EnquiryUpdate
)

class NotFoundError(Exception): pass
class DuplicateNameError(Exception): pass

class AdminHomepageService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminHomepageRepository(db)

    async def get_content(self):
        obj = await self.repo.get_singleton()
        if not obj:
            raise NotFoundError()
        return obj

    async def update_content(self, data: HomepageUpdate):
        obj = await self.get_content()
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        return await self.repo.update(obj)

class AdminAboutService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminAboutRepository(db)

    async def get_content(self):
        obj = await self.repo.get_singleton()
        if not obj:
            raise NotFoundError()
        return obj

    async def update_content(self, data: AboutUpdate):
        obj = await self.get_content()
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        return await self.repo.update(obj)

class AdminContactService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminContactRepository(db)

    async def get_content(self):
        obj = await self.repo.get_singleton()
        if not obj:
            raise NotFoundError()
        return obj

    async def update_content(self, data: ContactUpdate):
        obj = await self.get_content()
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        return await self.repo.update(obj)

class AdminBranchService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminBranchRepository(db)

    async def list_all(self):
        return await self.repo.list_all()

    async def get_by_id(self, id: str):
        obj = await self.repo.get_by_id(id)
        if not obj:
            raise NotFoundError()
        return obj

    async def create(self, data: BranchCreate):
        existing = await self.repo.get_by_name(data.name)
        if existing:
            raise DuplicateNameError(f"Branch '{data.name}' already exists.")
            
        obj = Branch(**data.model_dump(exclude_unset=True))
        try:
            return await self.repo.create(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateNameError("Database integrity error. Branch may already exist.")

    async def update(self, id: str, data: BranchUpdate):
        obj = await self.get_by_id(id)
        
        if data.name is not None:
            existing = await self.repo.get_by_name(data.name)
            if existing and existing.id != obj.id:
                raise DuplicateNameError(f"Branch '{data.name}' is already used by another record.")
                
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
            
        try:
            return await self.repo.update(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateNameError("Database integrity error during update.")

    async def delete(self, id: str):
        obj = await self.get_by_id(id)
        await self.repo.delete(obj)

class AdminEnquiryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminEnquiryRepository(db)

    async def list_all(self):
        return await self.repo.list_all()

    async def get_by_id(self, id: str):
        obj = await self.repo.get_by_id(id)
        if not obj:
            raise NotFoundError()
        return obj

    async def update(self, id: str, data: EnquiryUpdate):
        obj = await self.get_by_id(id)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        return await self.repo.update(obj)

    async def delete(self, id: str):
        obj = await self.get_by_id(id)
        await self.repo.delete(obj)
