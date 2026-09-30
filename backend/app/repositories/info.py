from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence

from app.models import AboutContent, ContactSetting, Branch, Enquiry
from app.repositories.base import BaseRepository

class AboutRepository(BaseRepository[AboutContent]):
    def __init__(self, session: AsyncSession):
        super().__init__(AboutContent, session)
        
    async def get_active(self) -> AboutContent | None:
        stmt = select(AboutContent)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

class ContactSettingRepository(BaseRepository[ContactSetting]):
    def __init__(self, session: AsyncSession):
        super().__init__(ContactSetting, session)
        
    async def get_active(self) -> ContactSetting | None:
        stmt = select(ContactSetting)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

class BranchRepository(BaseRepository[Branch]):
    def __init__(self, session: AsyncSession):
        super().__init__(Branch, session)

class EnquiryRepository(BaseRepository[Enquiry]):
    def __init__(self, session: AsyncSession):
        super().__init__(Enquiry, session)
