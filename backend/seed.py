"""
Seed script — populates master data for InfinityMind Tech.
Run: python seed.py
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import AsyncSessionLocal, engine, Base
from app.models import (
    Role, AdminUser, SiteSetting, HeroSection, AboutContent,
    ContactSetting, Branch, SocialLink,
    ProductCategory, Product, Service, Industry, TrainingProgram, FAQ,
    HomepageSection, NavigationItem
)
from app.core.security import hash_password
from app.config import settings


async def seed():
    # Ensure tables exist
    # async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # ----------------------------------------------------------------
        # Roles
        # ----------------------------------------------------------------
        superadmin_role = Role(name="superadmin", permissions={"all": True})
        editor_role = Role(name="editor", permissions={"content": True})
        db.add(superadmin_role)
        db.add(editor_role)
        await db.flush()

        # ----------------------------------------------------------------
        # Admin user
        # ----------------------------------------------------------------
        admin = AdminUser(
            name=settings.ADMIN_NAME,
            email=settings.ADMIN_EMAIL,
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
            role_id=superadmin_role.id,
        )
        db.add(admin)

        # ----------------------------------------------------------------
        # Site settings
        # ----------------------------------------------------------------
        site_settings_data = [
            ("site_name", "InfinityMind Tech Pvt. Ltd."),
            ("site_tagline", "Empowering AI, Cloud, and Blockchain Innovation"),
            ("site_description", "InfinityMind Tech Pvt Ltd offers innovative solutions in AI, Cloud Services, and Smart Tech for businesses in healthcare and beyond."),
            ("footer_description", "InfinityMind Tech Pvt. Ltd. is a cutting-edge software development company specializing in delivering innovative and reliable technology solutions."),
            ("copyright_text", "© 2013 Infinity Mind Tech. All rights reserved."),
            ("meta_default_title", "InfinityMind Tech — AI, Cloud & Smart Technology Solutions"),
            ("meta_default_description", "InfinityMind Tech Pvt Ltd offers innovative solutions in AI, Cloud Services, and Smart Tech for businesses in healthcare and beyond."),
            ("google_analytics_id", ""),
            ("privacy_policy_content", "Privacy policy content to be added by the administrator."),
            ("terms_content", "Terms and conditions content to be added by the administrator."),
            ("help_center_content", "Help center content to be added by the administrator."),
            ("careers_page_content", "Join us as we create the future and shape millions of lives globally every day! We are transforming our world and looking for others who want to make an impact."),
        ]
        for key, value in site_settings_data:
            db.add(SiteSetting(key=key, value=value))

        # ----------------------------------------------------------------
        # Hero section
        # ----------------------------------------------------------------
        db.add(HeroSection(
            eyebrow="Innovative Technology Solutions",
            heading="Infinity Mind Tech",
            description="Empowering AI, Cloud, and Blockchain Innovation",
            primary_cta_text="Explore Products",
            primary_cta_url="/products",
            secondary_cta_text="Contact Us",
            secondary_cta_url="/contact",
            is_active=True,
            display_order=1,
        ))

        # ----------------------------------------------------------------
        # Homepage sections
        # ----------------------------------------------------------------
        homepage_sections = [
            ("ai_research", "Research & Development in Artificial Intelligence for Healthcare",
             "At InfinityMind Tech Pvt Ltd, we are at the forefront of innovation with a dedicated focus on Artificial Intelligence (AI) Research and Development in the healthcare domain.", 1),
            ("cloud_services", "Cloud Services Innovative Solutions",
             "At InfinityMind Tech Pvt Ltd, we empower businesses to scale, secure, and transform with our robust and innovative Cloud Services.", 2),
            ("smart_tech", "Smart Tech Solutions",
             "At InfinityMind Tech Pvt Ltd, we understand the unique challenges and opportunities that Small and Medium Enterprises (SMEs) face in today's competitive digital landscape.", 3),
            ("startup_support", "Your Business Journey Starts Here",
             "At InfinityMind Tech Pvt Ltd, we specialize in providing innovative startup ideas and end-to-end business solutions for aspiring entrepreneurs.", 4),
            ("healthcare_innovation", "Transforming Healthcare Through Data-Driven Innovation",
             "At InfinityMind Tech Pvt Ltd, we specialize in providing innovative startup ideas and end-to-end business solutions for aspiring entrepreneurs.", 5),
        ]
        for key, title, desc, order in homepage_sections:
            db.add(HomepageSection(
                section_key=key, title=title, description=desc,
                cta_text="Learn More", cta_url="#",
                is_active=True, display_order=order,
            ))

        # ----------------------------------------------------------------
        # About content
        # ----------------------------------------------------------------
        db.add(AboutContent(
            company_name="InfinityMind Tech Pvt. Ltd.",
            tagline="Your Partner in Smart Solutions",
            overview="InfinityMind Tech Pvt. Ltd. is a cutting-edge software development company specializing in delivering innovative and reliable technology solutions. Choosing us means partnering with a team dedicated to your success. Infinity Mind Tech is a leading designer and manufacturer of products that Sense, Connect, and Move.",
            founder_name="R. Jeyantha Senan B.Tech, MBA",
            founder_title="Founder and Chairman",
            founder_message="""It Gives Me Immense Pride And Pleasure To Welcome You To InfinityMind Tech Pvt Ltd.
Since our inception in 2008, InfinityMind Tech has been driven by a single, powerful vision — to transform businesses through innovative software solutions. What began as a humble venture with a few passionate minds has today evolved into a dynamic technology company that continues to serve clients across industries with integrity, creativity, and excellence.
Our journey has been shaped by a deep commitment to quality, customer satisfaction, and continuous innovation. At InfinityMind Tech, we don't just build software — we build relationships, solve real-world problems, and empower businesses to reach their full potential.
As the Founder and Chairman, R. Jeyantha Senan B.Tech, MBA, have always believed in a future where technology simplifies lives, enhances productivity, and drives sustainable growth. Our talented teams of developers, engineers, and strategic thinkers strive to stay ahead of industry trends, delivering robust and scalable solutions tailored to our clients' evolving needs.
Looking ahead, We Remain Focused On Expanding Our Technological Horizons, embracing new digital paradigms, and fostering long-term value for our clients, partners, and stakeholders. We are committed to ethical growth, innovation-led development, and building a legacy that inspires the next generation of tech leaders.""",
            founded_year=2008,
            mission="We strive to provide innovative solutions that empower businesses to achieve their goals.",
            vision="To be the leading provider of cutting-edge technology solutions, making a positive impact worldwide.",
            future_vision="We help our clients navigate the rapidly changing technology landscape and position themselves for long-term success.",
            values="Our commitment to your success doesn't end with the delivery of a solution. Our dedicated support team is available to address any issues or concerns you may have.",
            commitment_items=[
                {"title": "Support & Maintenance", "description": "Our commitment to your success doesn't end with the delivery of a solution."},
                {"title": "Corporate Responsibility", "description": "InfinityMind Tech Pvt. Ltd. is committed to conducting business ethically and sustainably."},
                {"title": "Innovation and Quality", "description": "We continuously explore and adopt the latest technologies to deliver innovative solutions."},
                {"title": "Ethical and Sustainable Practices", "description": "We prioritize environmentally friendly practices, fair labor policies, and ethical business conduct."},
            ],
            why_choose_items=[
                {"title": "Expertise and Experience", "description": "Delivering high-quality IT solutions across industries with a strong history."},
                {"title": "Client-Centric Approach", "description": "We prioritize open communication and collaboration with our clients."},
                {"title": "Strong Security Focus", "description": "In today's digital world, security is paramount. We implement best practices in security and compliance."},
                {"title": "Competitive Pricing", "description": "We offer competitive pricing without compromising on quality."},
                {"title": "Comprehensive Service Offerings", "description": "We offer a wide range of services, from initial consulting and strategy development to implementation and ongoing support."},
            ],
        ))

        # ----------------------------------------------------------------
        # Contact
        # ----------------------------------------------------------------
        db.add(ContactSetting(
            primary_email="infinitymindtech@gmail.com",
            hr_email="hr@infinitymindtech.com",
            primary_phone="+91 8778521963",
            contact_form_enabled=True,
            contact_form_recipient="infinitymindtech@gmail.com",
        ))

        branches_data = [
            ("Chennai", True, 1),
            ("Bangalore", False, 2),
            ("Thiruvananthapuram", False, 3),
            ("Nagercoil", False, 4),
        ]
        for name, is_primary, order in branches_data:
            db.add(Branch(name=name, is_primary=is_primary, display_order=order))

        social_data = [
            ("facebook", "#", "Facebook", 1),
            ("instagram", "#", "Instagram", 2),
            ("linkedin", "#", "Linkedin", 3),
        ]
        for platform, url, icon, order in social_data:
            db.add(SocialLink(platform=platform, url=url, icon=icon, display_order=order))

        # ----------------------------------------------------------------
        # Product Categories
        # ----------------------------------------------------------------
        cat_data = [
            ("Billing & Finance", "billing-finance", 1),
            ("CRM & ERP", "crm-erp", 2),
            ("Web Designing Solutions", "web-designing-solutions", 3),
            ("IoT & Monitoring", "iot-monitoring", 4),
            ("Business Management", "business-management", 5),
        ]
        categories = {}
        for name, slug, order in cat_data:
            cat = ProductCategory(name=name, slug=slug, display_order=order)
            db.add(cat)
            categories[slug] = cat
        await db.flush()

        # ----------------------------------------------------------------
        # Products (all 30)
        # ----------------------------------------------------------------
        products_data = [
            ("Retail Billing", "retail-billing", "billing-finance", True, 1),
            ("POS", "pos", "billing-finance", False, 2),
            ("Vegetable Shop Billing", "vegetable-shop-billing", "billing-finance", False, 3),
            ("CocoCraft", "cococraft", "business-management", True, 4),
            ("CRM", "crm", "crm-erp", True, 5),
            ("StockGenius", "stockgenius", "crm-erp", False, 6),
            ("Restaurant Management", "restaurant-management", "business-management", True, 7),
            ("GoldFlow", "goldflow", "billing-finance", False, 8),
            ("ControllQ", "controllq", "iot-monitoring", False, 9),
            ("PresencePro", "presencepro", "iot-monitoring", False, 10),
            ("Zenpayroll", "zenpayroll", "billing-finance", True, 11),
            ("Hotel Booking Management", "hotel-booking-management", "business-management", True, 12),
            ("Weave Xpert", "weave-xpert", "business-management", False, 13),
            ("Static Web Designing", "static-web-designing", "web-designing-solutions", False, 14),
            ("Dynamic Web Designing", "dynamic-web-designing", "web-designing-solutions", False, 15),
            ("B2B Web Designing", "b2b-web-designing", "web-designing-solutions", False, 16),
            ("Ecommerce Web Designing", "ecommerce-web-designing", "web-designing-solutions", False, 17),
            ("Matrimonial Web Designing", "matrimonial-web-designing", "web-designing-solutions", False, 18),
            ("Job Web Designing", "job-web-designing", "web-designing-solutions", False, 19),
            ("SwiftDeliver", "swiftdeliver", "business-management", False, 20),
            ("AcademixPro", "academixpro", "crm-erp", False, 21),
            ("TurboBill", "turbobill", "billing-finance", False, 22),
            ("Automobile Service Billing", "automobile-service-billing", "billing-finance", False, 23),
            ("Fin Ease", "fin-ease", "billing-finance", False, 24),
            ("Warehouse Management", "warehouse-management", "crm-erp", False, 25),
            ("Door Sense", "door-sense", "iot-monitoring", False, 26),
            ("Rent Ease", "rent-ease", "business-management", False, 27),
            ("FeatherTrack", "feathertrack", "business-management", False, 28),
            ("BillGenius", "billgenius", "billing-finance", True, 29),
            ("Gold Loan Management", "gold-loan-management", "billing-finance", False, 30),
        ]
        for name, slug, cat_slug, is_featured, order in products_data:
            cat = categories.get(cat_slug)
            db.add(Product(
                name=name, slug=slug,
                category_id=cat.id if cat else None,
                is_active=True, is_featured=is_featured,
                display_order=order,
                short_description=f"{name} — to be updated by admin.",
            ))

        # ----------------------------------------------------------------
        # Services (8 confirmed)
        # ----------------------------------------------------------------
        services_data = [
            ("Mobile App Development", "mobile-app-development", "Smartphone", 1),
            ("Consulting", "consulting", "Briefcase", 2),
            ("Data Analytics", "data-analytics", "BarChart", 3),
            ("Digital Marketing", "digital-marketing", "Megaphone", 4),
            ("E-commerce", "e-commerce", "ShoppingCart", 5),
            ("Artificial Intelligence", "artificial-intelligence", "Brain", 6),
            ("Network Services", "network-services", "Network", 7),
            ("Blockchain", "blockchain", "Link", 8),
        ]
        for name, slug, icon, order in services_data:
            db.add(Service(
                name=name, slug=slug, icon=icon,
                is_active=True, is_featured=(order <= 6),
                display_order=order,
                short_description=f"{name} — to be updated by admin.",
            ))

        # ----------------------------------------------------------------
        # Industries (12 confirmed)
        # ----------------------------------------------------------------
        industries_data = [
            ("Healthcare", "healthcare", 1),
            ("Banking & Finance", "banking-finance", 2),
            ("E-commerce", "e-commerce", 3),
            ("Manufacturing", "manufacturing", 4),
            ("Telecommunication", "telecommunication", 5),
            ("Education", "education", 6),
            ("Public Services", "public-services", 7),
            ("Energy", "energy", 8),
            ("Hospitality", "hospitality", 9),
            ("Real Estate", "real-estate", 10),
            ("Autonomous Vehicle", "autonomous-vehicle", 11),
            ("Logistics", "logistics", 12),
        ]
        for name, slug, order in industries_data:
            db.add(Industry(
                name=name, slug=slug,
                is_active=True, display_order=order,
                short_description=f"{name} — to be updated by admin.",
            ))

        # ----------------------------------------------------------------
        # Training Programs (6 confirmed)
        # ----------------------------------------------------------------
        training_data = [
            ("Java Full Stack", "java-full-stack", "Master frontend (React, Angular) & backend (Spring Boot, Hibernate).", 1),
            ("Big Data – Full Stack", "big-data-full-stack", "Master Hadoop, Spark, Scala, Python, and cloud tools for end-to-end data engineering.", 2),
            ("PHP – Full Stack", "php-full-stack", "From core PHP to Laravel framework with MySQL and frontend technologies.", 3),
            ("IBM Mainframe", "ibm-mainframe", "Ideal for careers in banking, finance, insurance, and government sectors.", 4),
            ("Digital Marketing", "digital-marketing", "SEO, SEM, Social Media, Google Ads, Canva, WordPress & more.", 5),
            ("Android & iOS App Development", "android-ios-app-development", "Build mobile apps using Kotlin, Java (Android) and Swift (iOS). Includes UI/UX.", 6),
        ]
        for name, slug, desc, order in training_data:
            db.add(TrainingProgram(
                name=name, slug=slug,
                short_description=desc,
                is_active=True, display_order=order,
                who_can_apply=["Final Year Students", "Recent Graduates", "Anyone Passionate About Learning – No Experience Needed!"],
                what_you_gain=["Industry-Relevant Skillset", "Internship Certificate", "Live Project Experience", "Mentorship From Industry Experts", "Placement Assistance"],
                cta_text="Know More", cta_url="/contact",
            ))

        # ----------------------------------------------------------------
        # Navigation (primary)
        # ----------------------------------------------------------------
        nav_items = [
            ("Home", "/", "primary", None, 1),
            ("Industries", "/industries", "primary", None, 2),
            ("Services", "/services", "primary", None, 3),
            ("Products", "/products", "primary", None, 4),
            ("Who We Are", "#", "primary", None, 5),
            ("Career", "/careers", "primary", None, 6),
            ("Career Development", "/training", "primary", None, 7),
            ("Contact Us", "/contact", "primary", None, 8),
        ]
        nav_map = {}
        for label, url, location, parent_label, order in nav_items:
            item = NavigationItem(label=label, url=url, location=location, display_order=order)
            db.add(item)
            nav_map[label] = item
        await db.flush()

        # Sub-items for "Who We Are"
        who_parent = nav_map["Who We Are"]
        db.add(NavigationItem(label="About Us", url="/about", location="primary", parent_id=who_parent.id, display_order=1))

        await db.commit()
        print("✅ Seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
