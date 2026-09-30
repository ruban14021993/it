import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import AsyncSessionLocal
from app.models import ProductCategory, Product, Service, Industry, TrainingProgram
from app.models import HeroSection, AboutContent, ContactSetting, Branch, Enquiry

async def verify():
    async with AsyncSessionLocal() as db:
        cat_count = await db.scalar(select(func.count()).select_from(ProductCategory))
        prod_count = await db.scalar(select(func.count()).select_from(Product))
        svc_count = await db.scalar(select(func.count()).select_from(Service))
        ind_count = await db.scalar(select(func.count()).select_from(Industry))
        trn_count = await db.scalar(select(func.count()).select_from(TrainingProgram))
        
        print(f"Categories: {cat_count}")
        print(f"Products: {prod_count}")
        print(f"Services: {svc_count}")
        print(f"Industries: {ind_count}")
        print(f"Training: {trn_count}")

        t_branch = await db.scalar(select(func.count()).select_from(Branch).where(Branch.name.like("phase58-test%")))
        t_enq = await db.scalar(select(func.count()).select_from(Enquiry).where(Enquiry.name.like("phase58-test%")))
        
        print(f"Test Branches Remaining: {t_branch}")
        print(f"Test Enquiries Remaining: {t_enq}")
        
        hp_count = await db.scalar(select(func.count()).select_from(HeroSection))
        about_count = await db.scalar(select(func.count()).select_from(AboutContent))
        contact_count = await db.scalar(select(func.count()).select_from(ContactSetting))
        
        print(f"Homepage Singletons: {hp_count}")
        print(f"About Singletons: {about_count}")
        print(f"Contact Singletons: {contact_count}")

asyncio.run(verify())
