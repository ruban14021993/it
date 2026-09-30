import asyncio
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import Enquiry, Product, ProductCategory, Service, Industry, TrainingProgram

async def test_and_clean():
    async with AsyncSessionLocal() as session:
        # 1. Clean up the test enquiry
        print("Cleaning up test enquiry...")
        stmt = delete(Enquiry).where(Enquiry.email == "test@example.com")
        await session.execute(stmt)
        await session.commit()
        
        # Verify it's gone
        count = await session.scalar(select(Enquiry).where(Enquiry.email == "test@example.com"))
        if not count:
            print("Test enquiry removed successfully.")
        
        # 2. Add inactive items
        print("\nAdding inactive items for filter testing...")
        cat = ProductCategory(name="Inactive Cat", slug="inactive-cat", is_active=False)
        prod = Product(name="Inactive Prod", slug="inactive-prod", is_active=False)
        serv = Service(name="Inactive Serv", slug="inactive-serv", is_active=False)
        ind = Industry(name="Inactive Ind", slug="inactive-ind", is_active=False)
        train = TrainingProgram(name="Inactive Train", slug="inactive-train", is_active=False)
        
        session.add_all([cat, prod, serv, ind, train])
        await session.commit()
        
        print("Inactive items added.")
        
        # Keep IDs for cleanup
        cat_id, prod_id, serv_id, ind_id, train_id = cat.id, prod.id, serv.id, ind.id, train.id
        
        # Now we query using repositories directly to test the active filtering
        from app.repositories.content import ProductRepository, ProductCategoryRepository, ServiceRepository, IndustryRepository, TrainingRepository
        
        print("\nTesting repository active filtering...")
        p_repo = ProductRepository(session)
        c_repo = ProductCategoryRepository(session)
        s_repo = ServiceRepository(session)
        i_repo = IndustryRepository(session)
        t_repo = TrainingRepository(session)
        
        cats = await c_repo.list_published()
        print(f"Active Categories: {len(cats)} (Should not include Inactive Cat)")
        assert not any(c.slug == "inactive-cat" for c in cats)
        
        prods = await p_repo.list_published()
        print(f"Active Products: {len(prods)}")
        assert not any(p.slug == "inactive-prod" for p in prods)
        
        servs = await s_repo.list_published()
        print(f"Active Services: {len(servs)}")
        assert not any(s.slug == "inactive-serv" for s in servs)
        
        inds = await i_repo.list_published()
        print(f"Active Industries: {len(inds)}")
        assert not any(i.slug == "inactive-ind" for i in inds)
        
        trains = await t_repo.list_published()
        print(f"Active Trainings: {len(trains)}")
        assert not any(t.slug == "inactive-train" for t in trains)
        
        # 3. Clean up inactive items
        print("\nCleaning up inactive test items...")
        await session.execute(delete(ProductCategory).where(ProductCategory.id == cat_id))
        await session.execute(delete(Product).where(Product.id == prod_id))
        await session.execute(delete(Service).where(Service.id == serv_id))
        await session.execute(delete(Industry).where(Industry.id == ind_id))
        await session.execute(delete(TrainingProgram).where(TrainingProgram.id == train_id))
        await session.commit()
        print("Cleanup complete.")

if __name__ == "__main__":
    asyncio.run(test_and_clean())
