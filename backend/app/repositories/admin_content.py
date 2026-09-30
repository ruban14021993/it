from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence
from app.models import HeroSection, AboutContent, ContactSetting, Branch, Enquiry

class AdminHomepageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_singleton(self) -> HeroSection | None:
        stmt = select(HeroSection).order_by(HeroSection.display_order).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: HeroSection) -> HeroSection:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: HeroSection) -> HeroSection:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

class AdminAboutRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_singleton(self) -> AboutContent | None:
        stmt = select(AboutContent).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: AboutContent) -> AboutContent:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: AboutContent) -> AboutContent:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

class AdminContactRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_singleton(self) -> ContactSetting | None:
        stmt = select(ContactSetting).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: ContactSetting) -> ContactSetting:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: ContactSetting) -> ContactSetting:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

class AdminBranchRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_all(self) -> Sequence[Branch]:
        stmt = select(Branch).order_by(Branch.display_order)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, id: str) -> Branch | None:
        return await self.db.get(Branch, id)

    async def get_by_name(self, name: str) -> Branch | None:
        stmt = select(Branch).where(Branch.name == name)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: Branch) -> Branch:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: Branch) -> Branch:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete(self, obj: Branch) -> None:
        await self.db.delete(obj)
        await self.db.commit()

class AdminEnquiryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_all(self) -> Sequence[Enquiry]:
        stmt = select(Enquiry).order_by(Enquiry.created_at.desc())
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, id: str) -> Enquiry | None:
        return await self.db.get(Enquiry, id)

    async def update(self, obj: Enquiry) -> Enquiry:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete(self, obj: Enquiry) -> None:
        await self.db.delete(obj)
        await self.db.commit()
