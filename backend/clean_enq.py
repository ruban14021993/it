import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models import Enquiry

async def clean():
    async with AsyncSessionLocal() as db:
        stmt = select(Enquiry).where(Enquiry.name.like("phase58-test%"))
        res = await db.execute(stmt)
        for e in res.scalars():
            await db.delete(e)
        await db.commit()
        print("Cleaned!")

asyncio.run(clean())
