import asyncio
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import ProductCategory, Product, Service, Industry, TrainingProgram, AboutContent, ContactSetting, Branch

async def verify_db():
    async with AsyncSessionLocal() as session:
        # 1. Counts
        cat_count = await session.scalar(select(func.count()).select_from(ProductCategory))
        prod_count = await session.scalar(select(func.count()).select_from(Product))
        serv_count = await session.scalar(select(func.count()).select_from(Service))
        ind_count = await session.scalar(select(func.count()).select_from(Industry))
        train_count = await session.scalar(select(func.count()).select_from(TrainingProgram))
        
        print("=== ACTUAL COUNTS ===")
        print(f"Product Categories: {cat_count}")
        print(f"Products: {prod_count}")
        print(f"Services: {serv_count}")
        print(f"Industries: {ind_count}")
        print(f"Training Programs: {train_count}")
        
        # 2. Relationship Validation
        print("\n=== RELATIONSHIP VALIDATION ===")
        orphans = await session.scalar(select(func.count()).select_from(Product).where(Product.category_id == None))
        print(f"Orphan Products: {orphans}")
        
        # 3. Slugs and Statuses
        all_prods = await session.scalars(select(Product))
        valid_slugs = all(p.slug and " " not in p.slug for p in all_prods)
        print(f"Slugs Valid: {valid_slugs}")
        
        # 4. About & Contact
        print("\n=== ABOUT & CONTACT VALIDATION ===")
        about = await session.scalar(select(AboutContent))
        if about:
            print(f"Company: {about.company_name}")
            print(f"Founder: {about.founder_name} ({about.founder_title})")
            print(f"Established: {about.founded_year}")
        contact = await session.scalar(select(ContactSetting))
        if contact:
            print(f"Primary Email: {contact.primary_email}")
            print(f"HR Email: {contact.hr_email}")
            print(f"Phone: {contact.primary_phone}")
            
        # 5. Unsupported Data Check
        from app.models import FAQ, Enquiry, JobOpening, MediaAsset, Popup
        faqs = await session.scalar(select(func.count()).select_from(FAQ))
        enquiries = await session.scalar(select(func.count()).select_from(Enquiry))
        jobs = await session.scalar(select(func.count()).select_from(JobOpening))
        media = await session.scalar(select(func.count()).select_from(MediaAsset))
        popups = await session.scalar(select(func.count()).select_from(Popup))
        print("\n=== UNSUPPORTED DATA (Should be 0) ===")
        print(f"FAQs: {faqs}, Enquiries: {enquiries}, Jobs: {jobs}, Media: {media}, Popups: {popups}")

if __name__ == "__main__":
    asyncio.run(verify_db())
