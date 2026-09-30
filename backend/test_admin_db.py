import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.config import settings

async def main():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        result = await session.execute(text("SELECT id, email, is_active, hashed_password FROM admin_users"))
        users = result.fetchall()
        print(f"Total admin users: {len(users)}")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Active: {u.is_active}")
            # print first 10 chars of hash to verify it exists and looks like bcrypt
            print(f"Hash starts with: {u.hashed_password[:10] if u.hashed_password else 'NONE'}")
            print(f"Hash len: {len(u.hashed_password) if u.hashed_password else 0}")
    await engine.dispose()

asyncio.run(main())
