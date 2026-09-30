import asyncio
from sqlalchemy import text
from app.database import AsyncSessionLocal

async def clean_enquiries():
    async with AsyncSessionLocal() as session:
        await session.execute(text("DELETE FROM enquiries WHERE email = 'test@example.com'"))
        await session.commit()
        print('Cleaned up test enquiries.')

asyncio.run(clean_enquiries())
