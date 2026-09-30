import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import AsyncSessionLocal
from app.models import Product, ProductCategory, Service, Industry, TrainingProgram

async def clean():
    async with AsyncSessionLocal() as db:
        await db.execute(delete(Product).where(Product.slug.like('test-%')))
        await db.execute(delete(ProductCategory).where(ProductCategory.slug.like('test-%')))
        await db.execute(delete(Service).where(Service.slug.like('test-%')))
        await db.execute(delete(Industry).where(Industry.slug.like('test-%')))
        await db.execute(delete(TrainingProgram).where(TrainingProgram.slug.like('test-%')))
        await db.commit()

asyncio.run(clean())
