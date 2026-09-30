import asyncio
import logging
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import (
    ProductCategory, Product, Service, Industry, TrainingProgram,
    ContactSetting, Branch, AboutContent
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------
# Verified Seed Data
# ---------------------------------------------------------

CATEGORIES = [
    {"slug": "billing-finance", "name": "Billing & Finance", "display_order": 1},
    {"slug": "crm-erp", "name": "CRM & ERP", "display_order": 2},
    {"slug": "web-designing-solutions", "name": "Web Designing Solutions", "display_order": 3},
    {"slug": "iot-monitoring", "name": "IoT & Monitoring", "display_order": 4},
    {"slug": "business-management", "name": "Business Management", "display_order": 5},
]

PRODUCTS = [
    {"slug": "retail-billing", "name": "Retail Billing", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": True, "display_order": 1},
    {"slug": "pos", "name": "POS", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": False, "display_order": 2},
    {"slug": "vegetable-shop-billing", "name": "Vegetable Shop Billing", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": False, "display_order": 3},
    {"slug": "cococraft", "name": "CocoCraft", "short_description": "Business Management software solution.", "category_slug": "business-management", "is_featured": True, "display_order": 4},
    {"slug": "crm", "name": "CRM", "short_description": "CRM & ERP software solution.", "category_slug": "crm-erp", "is_featured": True, "display_order": 5},
    {"slug": "stockgenius", "name": "StockGenius", "short_description": "CRM & ERP software solution.", "category_slug": "crm-erp", "is_featured": False, "display_order": 6},
    {"slug": "restaurant-management", "name": "Restaurant Management", "short_description": "Business Management software solution.", "category_slug": "business-management", "is_featured": True, "display_order": 7},
    {"slug": "goldflow", "name": "GoldFlow", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": False, "display_order": 8},
    {"slug": "controllq", "name": "ControllQ", "short_description": "IoT & Monitoring software solution.", "category_slug": "iot-monitoring", "is_featured": False, "display_order": 9},
    {"slug": "presencepro", "name": "PresencePro", "short_description": "IoT & Monitoring software solution.", "category_slug": "iot-monitoring", "is_featured": False, "display_order": 10},
    {"slug": "zenpayroll", "name": "Zenpayroll", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": True, "display_order": 11},
    {"slug": "hotel-booking-management", "name": "Hotel Booking Management", "short_description": "Business Management software solution.", "category_slug": "business-management", "is_featured": True, "display_order": 12},
    {"slug": "weave-xpert", "name": "Weave Xpert", "short_description": "Business Management software solution.", "category_slug": "business-management", "is_featured": False, "display_order": 13},
    {"slug": "static-web-designing", "name": "Static Web Designing", "short_description": "Web Designing Solutions software solution.", "category_slug": "web-designing-solutions", "is_featured": False, "display_order": 14},
    {"slug": "dynamic-web-designing", "name": "Dynamic Web Designing", "short_description": "Web Designing Solutions software solution.", "category_slug": "web-designing-solutions", "is_featured": False, "display_order": 15},
    {"slug": "b2b-web-designing", "name": "B2B Web Designing", "short_description": "Web Designing Solutions software solution.", "category_slug": "web-designing-solutions", "is_featured": False, "display_order": 16},
    {"slug": "ecommerce-web-designing", "name": "Ecommerce Web Designing", "short_description": "Web Designing Solutions software solution.", "category_slug": "web-designing-solutions", "is_featured": False, "display_order": 17},
    {"slug": "matrimonial-web-designing", "name": "Matrimonial Web Designing", "short_description": "Web Designing Solutions software solution.", "category_slug": "web-designing-solutions", "is_featured": False, "display_order": 18},
    {"slug": "job-web-designing", "name": "Job Web Designing", "short_description": "Web Designing Solutions software solution.", "category_slug": "web-designing-solutions", "is_featured": False, "display_order": 19},
    {"slug": "swiftdeliver", "name": "SwiftDeliver", "short_description": "Business Management software solution.", "category_slug": "business-management", "is_featured": False, "display_order": 20},
    {"slug": "academixpro", "name": "AcademixPro", "short_description": "CRM & ERP software solution.", "category_slug": "crm-erp", "is_featured": False, "display_order": 21},
    {"slug": "turbobill", "name": "TurboBill", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": False, "display_order": 22},
    {"slug": "automobile-service-billing", "name": "Automobile Service Billing", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": False, "display_order": 23},
    {"slug": "fin-ease", "name": "Fin Ease", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": False, "display_order": 24},
    {"slug": "warehouse-management", "name": "Warehouse Management", "short_description": "CRM & ERP software solution.", "category_slug": "crm-erp", "is_featured": False, "display_order": 25},
    {"slug": "door-sense", "name": "Door Sense", "short_description": "IoT & Monitoring software solution.", "category_slug": "iot-monitoring", "is_featured": False, "display_order": 26},
    {"slug": "rent-ease", "name": "Rent Ease", "short_description": "Business Management software solution.", "category_slug": "business-management", "is_featured": False, "display_order": 27},
    {"slug": "feathertrack", "name": "FeatherTrack", "short_description": "Business Management software solution.", "category_slug": "business-management", "is_featured": False, "display_order": 28},
    {"slug": "billgenius", "name": "BillGenius", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": True, "display_order": 29},
    {"slug": "gold-loan-management", "name": "Gold Loan Management", "short_description": "Billing & Finance software solution.", "category_slug": "billing-finance", "is_featured": False, "display_order": 30},
]

SERVICES = [
    {"slug": "mobile-app-development", "name": "Mobile App Development", "icon": "Smartphone", "is_featured": True, "display_order": 1},
    {"slug": "consulting", "name": "Consulting", "icon": "Briefcase", "is_featured": True, "display_order": 2},
    {"slug": "data-analytics", "name": "Data Analytics", "icon": "BarChart", "is_featured": True, "display_order": 3},
    {"slug": "digital-marketing", "name": "Digital Marketing", "icon": "Megaphone", "is_featured": True, "display_order": 4},
    {"slug": "e-commerce", "name": "E-commerce", "icon": "ShoppingCart", "is_featured": True, "display_order": 5},
    {"slug": "artificial-intelligence", "name": "Artificial Intelligence", "icon": "Brain", "is_featured": True, "display_order": 6},
    {"slug": "network-services", "name": "Network Services", "icon": "Network", "is_featured": False, "display_order": 7},
    {"slug": "blockchain", "name": "Blockchain", "icon": "Link", "is_featured": False, "display_order": 8},
]

INDUSTRIES = [
    {"slug": "healthcare", "name": "Healthcare", "display_order": 1},
    {"slug": "banking-finance", "name": "Banking & Finance", "display_order": 2},
    {"slug": "e-commerce", "name": "E-commerce", "display_order": 3},
    {"slug": "manufacturing", "name": "Manufacturing", "display_order": 4},
    {"slug": "telecommunication", "name": "Telecommunication", "display_order": 5},
    {"slug": "education", "name": "Education", "display_order": 6},
    {"slug": "public-services", "name": "Public Services", "display_order": 7},
    {"slug": "energy", "name": "Energy", "display_order": 8},
    {"slug": "hospitality", "name": "Hospitality", "display_order": 9},
    {"slug": "real-estate", "name": "Real Estate", "display_order": 10},
    {"slug": "autonomous-vehicle", "name": "Autonomous Vehicle", "display_order": 11},
    {"slug": "logistics", "name": "Logistics", "display_order": 12},
]

TRAINING = [
    {"slug": "java-full-stack", "name": "Java Full Stack", "short_description": "Master frontend (React, Angular) & backend (Spring Boot, Hibernate).", "who_can_apply": ["Final Year Students", "Recent Graduates", "Anyone Passionate About Learning — No Experience Needed!"], "what_you_gain": ["Industry-Relevant Skillset", "Internship Certificate", "Live Project Experience", "Mentorship From Industry Experts", "Placement Assistance"], "display_order": 1},
    {"slug": "big-data-full-stack", "name": "Big Data — Full Stack", "short_description": "Master Hadoop, Spark, Scala, Python, and cloud tools for end-to-end data engineering.", "who_can_apply": ["Final Year Students", "Recent Graduates", "Anyone Passionate About Learning — No Experience Needed!"], "what_you_gain": ["Industry-Relevant Skillset", "Internship Certificate", "Live Project Experience", "Mentorship From Industry Experts", "Placement Assistance"], "display_order": 2},
    {"slug": "php-full-stack", "name": "PHP — Full Stack", "short_description": "From core PHP to Laravel framework with MySQL and frontend technologies.", "who_can_apply": ["Final Year Students", "Recent Graduates", "Anyone Passionate About Learning — No Experience Needed!"], "what_you_gain": ["Industry-Relevant Skillset", "Internship Certificate", "Live Project Experience", "Mentorship From Industry Experts", "Placement Assistance"], "display_order": 3},
    {"slug": "ibm-mainframe", "name": "IBM Mainframe", "short_description": "Ideal for careers in banking, finance, insurance, and government sectors.", "who_can_apply": ["Final Year Students", "Recent Graduates", "Anyone Passionate About Learning — No Experience Needed!"], "what_you_gain": ["Industry-Relevant Skillset", "Internship Certificate", "Live Project Experience", "Mentorship From Industry Experts", "Placement Assistance"], "display_order": 4},
    {"slug": "digital-marketing", "name": "Digital Marketing", "short_description": "SEO, SEM, Social Media, Google Ads, Canva, WordPress & more.", "who_can_apply": ["Final Year Students", "Recent Graduates", "Anyone Passionate About Learning — No Experience Needed!"], "what_you_gain": ["Industry-Relevant Skillset", "Internship Certificate", "Live Project Experience", "Mentorship From Industry Experts", "Placement Assistance"], "display_order": 5},
    {"slug": "android-ios-app-development", "name": "Android & iOS App Development", "short_description": "Build mobile apps using Kotlin, Java (Android) and Swift (iOS). Includes UI/UX.", "who_can_apply": ["Final Year Students", "Recent Graduates", "Anyone Passionate About Learning — No Experience Needed!"], "what_you_gain": ["Industry-Relevant Skillset", "Internship Certificate", "Live Project Experience", "Mentorship From Industry Experts", "Placement Assistance"], "display_order": 6},
]

BRANCHES = [
    {"name": "Chennai", "is_primary": True, "display_order": 1},
    {"name": "Bangalore", "is_primary": False, "display_order": 2},
    {"name": "Thiruvananthapuram", "is_primary": False, "display_order": 3},
    {"name": "Nagercoil", "is_primary": False, "display_order": 4},
]

async def seed_categories(db: AsyncSession):
    for data in CATEGORIES:
        res = await db.execute(select(ProductCategory).where(ProductCategory.slug == data["slug"]))
        existing = res.scalar_one_or_none()
        if not existing:
            obj = ProductCategory(
                name=data["name"],
                slug=data["slug"],
                display_order=data["display_order"]
            )
            db.add(obj)
    await db.commit()

async def seed_products(db: AsyncSession):
    res = await db.execute(select(ProductCategory))
    cat_map = {c.slug: c.id for c in res.scalars().all()}
    
    for data in PRODUCTS:
        res = await db.execute(select(Product).where(Product.slug == data["slug"]))
        existing = res.scalar_one_or_none()
        if not existing:
            obj = Product(
                name=data["name"],
                slug=data["slug"],
                short_description=data["short_description"],
                category_id=cat_map.get(data["category_slug"]),
                is_featured=data["is_featured"],
                display_order=data["display_order"]
            )
            db.add(obj)
    await db.commit()

async def seed_services(db: AsyncSession):
    for data in SERVICES:
        res = await db.execute(select(Service).where(Service.slug == data["slug"]))
        existing = res.scalar_one_or_none()
        if not existing:
            obj = Service(
                name=data["name"],
                slug=data["slug"],
                icon=data["icon"],
                is_featured=data["is_featured"],
                display_order=data["display_order"]
            )
            db.add(obj)
    await db.commit()

async def seed_industries(db: AsyncSession):
    for data in INDUSTRIES:
        res = await db.execute(select(Industry).where(Industry.slug == data["slug"]))
        existing = res.scalar_one_or_none()
        if not existing:
            obj = Industry(
                name=data["name"],
                slug=data["slug"],
                display_order=data["display_order"]
            )
            db.add(obj)
    await db.commit()

async def seed_training(db: AsyncSession):
    for data in TRAINING:
        res = await db.execute(select(TrainingProgram).where(TrainingProgram.slug == data["slug"]))
        existing = res.scalar_one_or_none()
        if not existing:
            obj = TrainingProgram(
                name=data["name"],
                slug=data["slug"],
                short_description=data["short_description"],
                who_can_apply=data["who_can_apply"],
                what_you_gain=data["what_you_gain"],
                display_order=data["display_order"]
            )
            db.add(obj)
    await db.commit()

async def seed_company_info(db: AsyncSession):
    # Branches
    for data in BRANCHES:
        res = await db.execute(select(Branch).where(Branch.name == data["name"]))
        existing = res.scalar_one_or_none()
        if not existing:
            obj = Branch(
                name=data["name"],
                is_primary=data["is_primary"],
                display_order=data["display_order"]
            )
            db.add(obj)
    
    # Contact Setting
    res = await db.execute(select(ContactSetting))
    contact = res.scalars().first()
    if not contact:
        contact = ContactSetting(
            primary_email="infinitymindtech@gmail.com",
            hr_email="hr@infinitymindtech.com",
            primary_phone="+91 8778521963",
            contact_form_enabled=True,
        )
        db.add(contact)
        
    # About Content
    res = await db.execute(select(AboutContent))
    about = res.scalars().first()
    if not about:
        about = AboutContent(
            company_name="InfinityMind Tech Pvt. Ltd.",
            founded_year=2008,
            founder_name="R. Jeyantha Senan",
            founder_title="B.Tech, MBA, Founder/Chairman"
        )
        db.add(about)
        
    await db.commit()

async def async_main():
    logger.info("Starting async seed process...")
    async with AsyncSessionLocal() as db:
        try:
            await seed_categories(db)
            logger.info("Seeded categories.")
            await seed_products(db)
            logger.info("Seeded products.")
            await seed_services(db)
            logger.info("Seeded services.")
            await seed_industries(db)
            logger.info("Seeded industries.")
            await seed_training(db)
            logger.info("Seeded training programs.")
            await seed_company_info(db)
            logger.info("Seeded company information.")
            logger.info("Seed process completed successfully.")
        except Exception as e:
            logger.error(f"Seed process failed: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(async_main())
