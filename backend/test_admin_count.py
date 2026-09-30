import asyncio
from sqlalchemy import text
from app.database import AsyncSessionLocal

async def check():
    async with AsyncSessionLocal() as s:
        r = await s.execute(text("SELECT count(*) FROM admin_users"))
        print(f"Admin users count: {r.scalar()}")
        
        r = await s.execute(text("SELECT count(*) FROM admin_users WHERE email='admin@infinitymindtech.com'"))
        print(f"Unique admin email count: {r.scalar()}")

asyncio.run(check())
