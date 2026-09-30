import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.config import settings
from app.core.security import verify_password

async def main():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        result = await session.execute(text("SELECT email, hashed_password FROM admin_users WHERE email = :email"), {'email': settings.ADMIN_EMAIL})
        user = result.fetchone()
        if user:
            print(f"User found: {user.email}")
            is_valid = verify_password(settings.ADMIN_PASSWORD, user.hashed_password)
            print(f"Password verification: {is_valid}")
        else:
            print("User not found.")
    await engine.dispose()

asyncio.run(main())
