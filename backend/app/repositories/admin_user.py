from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from app.models import AdminUser

class AdminUserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str) -> AdminUser | None:
        result = await self.db.execute(select(AdminUser).where(AdminUser.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> AdminUser | None:
        result = await self.db.execute(select(AdminUser).where(AdminUser.email == email))
        return result.scalar_one_or_none()

    async def update_last_login(self, admin: AdminUser) -> None:
        admin.last_login_at = datetime.now(timezone.utc)
        self.db.add(admin)
        await self.db.commit()
