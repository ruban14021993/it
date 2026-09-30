import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import ProductCategory, Product, Service, Industry, TrainingProgram, AboutContent, ContactSetting, Branch

PRODUCT_CATEGORIES = [
    {"name": "Billing & Finance", "slug": "billing-finance", "display_order": 1},
    {"name": "CRM & ERP", "slug": "crm-erp", "display_order": 2},
    {"name": "Web Designing Solutions", "slug": "web-designing-solutions", "display_order": 3},
    {"name": "IoT & Monitoring", "slug": "iot-monitoring", "display_order": 4},
    {"name": "Business Management", "slug": "business-management", "display_order": 5},
]

PRODUCTS = [
    ("Retail Billing", "retail-billing", "billing-finance"),
    ("POS", "pos", "billing-finance"),
    ("Vegetable Shop Billing", "vegetable-shop-billing", "billing-finance"),
    ("CocoCraft", "cococraft", "business-management"),
    ("CRM", "crm", "crm-erp"),
    ("StockGenius", "stockgenius", "crm-erp"),
    ("Restaurant Management", "restaurant-management", "business-management"),
    ("GoldFlow", "goldflow", "billing-finance"),
    ("ControllQ", "controllq", "iot-monitoring"),
    ("PresencePro", "presencepro", "iot-monitoring"),
    ("Zenpayroll", "zenpayroll", "billing-finance"),
    ("Hotel Booking Management", "hotel-booking-management", "business-management"),
    ("Weave Xpert", "weave-xpert", "business-management"),
    ("Static Web Designing", "static-web-designing", "web-designing-solutions"),
    ("Dynamic Web Designing", "dynamic-web-designing", "web-designing-solutions"),
    ("B2B Web Designing", "b2b-web-designing", "web-designing-solutions"),
    ("Ecommerce Web Designing", "ecommerce-web-designing", "web-designing-solutions"),
    ("Matrimonial Web Designing", "matrimonial-web-designing", "web-designing-solutions"),
    ("Job Web Designing", "job-web-designing", "web-designing-solutions"),
    ("SwiftDeliver", "swiftdeliver", "business-management"),
    ("AcademixPro", "academixpro", "crm-erp"),
    ("TurboBill", "turbobill", "billing-finance"),
    ("Automobile Service Billing", "automobile-service-billing", "billing-finance"),
    ("Fin Ease", "fin-ease", "billing-finance"),
    ("Warehouse Management", "warehouse-management", "crm-erp"),
    ("Door Sense", "door-sense", "iot-monitoring"),
    ("Rent Ease", "rent-ease", "business-management"),
    ("FeatherTrack", "feathertrack", "business-management"),
    ("BillGenius", "billgenius", "billing-finance"),
    ("Gold Loan Management", "gold-loan-management", "billing-finance"),
]

SERVICES = [
    ("Mobile App Development", "mobile-app-development"),
    ("Consulting", "consulting"),
    ("Data Analytics", "data-analytics"),
    ("Digital Marketing", "digital-marketing"),
    ("E-commerce", "e-commerce"),
    ("Artificial Intelligence", "artificial-intelligence"),
    ("Network Services", "network-services"),
    ("Blockchain", "blockchain"),
]

INDUSTRIES = [
    ("Healthcare", "healthcare"),
    ("Banking & Finance", "banking-finance"),
    ("E-commerce", "e-commerce"),
    ("Manufacturing", "manufacturing"),
    ("Telecommunication", "telecommunication"),
    ("Education", "education"),
    ("Public Services", "public-services"),
    ("Energy", "energy"),
    ("Hospitality", "hospitality"),
    ("Real Estate", "real-estate"),
    ("Autonomous Vehicle", "autonomous-vehicle"),
    ("Logistics", "logistics"),
]

TRAINING = [
    ("Java Full Stack", "java-full-stack"),
    ("Big Data — Full Stack", "big-data-full-stack"),
    ("PHP — Full Stack", "php-full-stack"),
    ("IBM Mainframe", "ibm-mainframe"),
    ("Digital Marketing", "digital-marketing"),
    ("Android & iOS App Development", "android-ios-app-development"),
]

BRANCHES = [
    "Chennai",
    "Bangalore",
    "Thiruvananthapuram",
    "Nagercoil"
]

async def seed_data():
    print("Starting database seed...")
    async with AsyncSessionLocal() as session:
        try:
            # 1. Categories
            for cat_data in PRODUCT_CATEGORIES:
                stmt = select(ProductCategory).where(ProductCategory.slug == cat_data["slug"])
                res = await session.execute(stmt)
                existing = res.scalar_one_or_none()
                if not existing:
                    session.add(ProductCategory(**cat_data))
                    print(f"Added Category: {cat_data['name']}")
            
            # Flush to get IDs for the foreign key mapping in the same transaction
            await session.flush()
            
            # Fetch categories mapping
            stmt = select(ProductCategory)
            res = await session.execute(stmt)
            cat_map = {c.slug: c.id for c in res.scalars().all()}
            
            # 2. Products
            for i, (name, slug, cat_slug) in enumerate(PRODUCTS):
                stmt = select(Product).where(Product.slug == slug)
                res = await session.execute(stmt)
                if not res.scalar_one_or_none():
                    session.add(Product(
                        name=name, slug=slug, category_id=cat_map.get(cat_slug), display_order=i+1
                    ))
                    print(f"Added Product: {name}")
            
            # 3. Services
            for i, (name, slug) in enumerate(SERVICES):
                stmt = select(Service).where(Service.slug == slug)
                res = await session.execute(stmt)
                if not res.scalar_one_or_none():
                    session.add(Service(name=name, slug=slug, display_order=i+1))
                    print(f"Added Service: {name}")
                    
            # 4. Industries
            for i, (name, slug) in enumerate(INDUSTRIES):
                stmt = select(Industry).where(Industry.slug == slug)
                res = await session.execute(stmt)
                if not res.scalar_one_or_none():
                    session.add(Industry(name=name, slug=slug, display_order=i+1))
                    print(f"Added Industry: {name}")
                    
            # 5. Training
            for i, (name, slug) in enumerate(TRAINING):
                stmt = select(TrainingProgram).where(TrainingProgram.slug == slug)
                res = await session.execute(stmt)
                if not res.scalar_one_or_none():
                    session.add(TrainingProgram(name=name, slug=slug, display_order=i+1))
                    print(f"Added Training: {name}")
                    
            # 6. About Info
            stmt = select(AboutContent)
            res = await session.execute(stmt)
            if not res.scalar_one_or_none():
                session.add(AboutContent(
                    company_name="InfinityMind Tech Pvt. Ltd.",
                    founder_name="R. Jeyantha Senan",
                    founder_title="Founder/Chairman, B.Tech, MBA",
                    founded_year=2008
                ))
                print("Added About Content")

            # 7. Contact Settings
            stmt = select(ContactSetting)
            res = await session.execute(stmt)
            if not res.scalar_one_or_none():
                session.add(ContactSetting(
                    primary_email="infinitymindtech@gmail.com",
                    hr_email="hr@infinitymindtech.com",
                    primary_phone="+91 8778521963"
                ))
                print("Added Contact Settings")

            # 8. Branches
            for i, branch in enumerate(BRANCHES):
                stmt = select(Branch).where(Branch.name == branch)
                res = await session.execute(stmt)
                if not res.scalar_one_or_none():
                    session.add(Branch(
                        name=branch,
                        display_order=i+1
                    ))
                    print(f"Added Branch: {branch}")

            # Commit the single transaction
            await session.commit()
            print("Seed execution completed successfully.")
            
        except Exception as e:
            await session.rollback()
            print(f"Seed failed with error: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(seed_data())
