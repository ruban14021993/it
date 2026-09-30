import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models import AdminUser, Role
from app.core.security import hash_password
from app.config import settings

async def seed_admin():
    async with AsyncSessionLocal() as db:
        # Check if admin already exists
        result = await db.execute(select(AdminUser).where(AdminUser.email == settings.ADMIN_EMAIL))
        admin = result.scalar_one_or_none()
        
        if admin:
            print("Admin user already exists. Seed skipped.")
            return

        # Check if role exists
        result = await db.execute(select(Role).where(Role.name == "Super Admin"))
        role = result.scalar_one_or_none()
        
        if not role:
            role = Role(
                name="Super Admin",
                permissions={"all": True}
            )
            db.add(role)
            await db.commit()
            await db.refresh(role)
            print("Created Super Admin role.")

        # Create admin user
        admin = AdminUser(
            name=settings.ADMIN_NAME,
            email=settings.ADMIN_EMAIL,
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
            role_id=role.id,
            is_active=True
        )
        db.add(admin)
        await db.commit()
        print(f"Created admin user: {settings.ADMIN_EMAIL}")

if __name__ == "__main__":
    asyncio.run(seed_admin())
