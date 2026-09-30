import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.database import AsyncSessionLocal
from app.models import ProductCategory, Product, Service, Industry, TrainingProgram

async def verify():
    async with AsyncSessionLocal() as db:
        # Counts
        cat_count = await db.scalar(select(func.count()).select_from(ProductCategory))
        prod_count = await db.scalar(select(func.count()).select_from(Product))
        svc_count = await db.scalar(select(func.count()).select_from(Service))
        ind_count = await db.scalar(select(func.count()).select_from(Industry))
        trn_count = await db.scalar(select(func.count()).select_from(TrainingProgram))
        
        print("--- Direct DB Counts ---")
        print(f"Categories: {cat_count}")
        print(f"Products: {prod_count}")
        print(f"Services: {svc_count}")
        print(f"Industries: {ind_count}")
        print(f"Training: {trn_count}")
        
        # Test Records
        t_cat = await db.scalar(select(func.count()).select_from(ProductCategory).where(ProductCategory.slug.like("test-%")))
        t_prod = await db.scalar(select(func.count()).select_from(Product).where(Product.slug.like("test-%")))
        t_svc = await db.scalar(select(func.count()).select_from(Service).where(Service.slug.like("test-%")))
        t_ind = await db.scalar(select(func.count()).select_from(Industry).where(Industry.slug.like("test-%")))
        t_trn = await db.scalar(select(func.count()).select_from(TrainingProgram).where(TrainingProgram.slug.like("test-%")))
        
        print("\n--- Test Record Counts ---")
        print(f"Test Categories: {t_cat}")
        print(f"Test Products: {t_prod}")
        print(f"Test Services: {t_svc}")
        print(f"Test Industries: {t_ind}")
        print(f"Test Training: {t_trn}")
        
        # Orphan / Relationship check
        # Products that have a category_id that DOES NOT exist in ProductCategory table
        orphan_query = text("""
            SELECT count(*) 
            FROM products p 
            LEFT JOIN product_categories c ON p.category_id = c.id 
            WHERE p.category_id IS NOT NULL AND c.id IS NULL
        """)
        orphan_count = await db.scalar(orphan_query)
        print("\n--- Relationship Verification ---")
        print(f"Orphaned Products: {orphan_count}")

asyncio.run(verify())
