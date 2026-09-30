import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import AsyncSessionLocal
from app.models import Branch, Enquiry

async def verify():
    async with AsyncSessionLocal() as db:
        t_branch = await db.scalar(select(func.count()).select_from(Branch).where(Branch.name.like("phase58-test%")))
        t_enq = await db.scalar(select(func.count()).select_from(Enquiry).where(Enquiry.name.like("phase58-test%")))
        
        print(f"Test Branches Remaining: {t_branch}")
        print(f"Test Enquiries Remaining: {t_enq}")

asyncio.run(verify())
