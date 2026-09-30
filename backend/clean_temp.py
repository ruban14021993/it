import asyncio
from sqlalchemy import text
from app.database import AsyncSessionLocal

async def clean():
    async with AsyncSessionLocal() as session:
        await session.execute(text("DELETE FROM products WHERE slug LIKE 'test-temp-%'"))
        await session.execute(text("DELETE FROM product_categories WHERE slug LIKE 'test-temp-%'"))
        await session.commit()
        print("Cleaned temp records.")

asyncio.run(clean())
