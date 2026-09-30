import asyncio
from sqlalchemy import delete
from app.database import AsyncSessionLocal
from app.models import Enquiry

async def clean():
    async with AsyncSessionLocal() as session:
        await session.execute(delete(Enquiry).where(Enquiry.email == "another@test.com"))
        await session.commit()
        print("Done.")

if __name__ == "__main__":
    asyncio.run(clean())
