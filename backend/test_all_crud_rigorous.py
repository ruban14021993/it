import asyncio
import httpx
import uuid
from app.config import settings
from app.database import AsyncSessionLocal
from sqlalchemy import text

async def test_all():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # Auth
        r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
        assert r.status_code == 200, "Login failed"
        token = r.json()["access_token"]
        auth = {"Authorization": f"Bearer {token}"}
        no_auth = {}
        invalid_uuid = "00000000-0000-0000-0000-000000000000"

        async def run_crud_suite(name, prefix, create_data, update_data, update_check_key, update_check_val):
            print(f"Testing {name}...")
            # Unauth tests
            assert (await client.get(f"/api/v1/admin/{prefix}", headers=no_auth)).status_code == 401
            assert (await client.get(f"/api/v1/admin/{prefix}/{invalid_uuid}", headers=no_auth)).status_code == 401
            assert (await client.post(f"/api/v1/admin/{prefix}", json=create_data, headers=no_auth)).status_code == 401
            assert (await client.put(f"/api/v1/admin/{prefix}/{invalid_uuid}", json=update_data, headers=no_auth)).status_code == 401
            assert (await client.delete(f"/api/v1/admin/{prefix}/{invalid_uuid}", headers=no_auth)).status_code == 401

            # List
            r_list = await client.get(f"/api/v1/admin/{prefix}", headers=auth)
            assert r_list.status_code == 200
            
            # Detail non-existent
            assert (await client.get(f"/api/v1/admin/{prefix}/{invalid_uuid}", headers=auth)).status_code == 404
            
            # Create
            uid = str(uuid.uuid4())[:8]
            cd1 = create_data.copy()
            cd1["slug"] = f"slug-1-{uid}"
            r1 = await client.post(f"/api/v1/admin/{prefix}", json=cd1, headers=auth)
            assert r1.status_code == 201, f"{name} create failed: {r1.text}"
            id1 = r1.json()["id"]

            cd2 = create_data.copy()
            cd2["slug"] = f"slug-2-{uid}"
            r2 = await client.post(f"/api/v1/admin/{prefix}", json=cd2, headers=auth)
            assert r2.status_code == 201
            id2 = r2.json()["id"]

            # Duplicate create
            assert (await client.post(f"/api/v1/admin/{prefix}", json=cd1, headers=auth)).status_code == 409
            
            # Detail existing
            assert (await client.get(f"/api/v1/admin/{prefix}/{id1}", headers=auth)).status_code == 200
            
            # Update duplicate slug
            assert (await client.put(f"/api/v1/admin/{prefix}/{id2}", json={"slug": cd1["slug"]}, headers=auth)).status_code == 409
            
            # Update valid
            r_upd = await client.put(f"/api/v1/admin/{prefix}/{id2}", json=update_data, headers=auth)
            assert r_upd.status_code == 200
            
            # Verify update persisted
            r_det = await client.get(f"/api/v1/admin/{prefix}/{id2}", headers=auth)
            assert r_det.json()[update_check_key] == update_check_val
            
            # Update non-existent
            assert (await client.put(f"/api/v1/admin/{prefix}/{invalid_uuid}", json=update_data, headers=auth)).status_code == 404
            
            # Delete valid
            assert (await client.delete(f"/api/v1/admin/{prefix}/{id1}", headers=auth)).status_code in [200, 204]
            assert (await client.delete(f"/api/v1/admin/{prefix}/{id2}", headers=auth)).status_code in [200, 204]
            
            # Delete non-existent
            assert (await client.delete(f"/api/v1/admin/{prefix}/{invalid_uuid}", headers=auth)).status_code == 404

        await run_crud_suite("Categories", "products/categories", 
                             {"name": "Cat", "display_order": 1}, 
                             {"name": "Cat Upd", "display_order": 9}, "name", "Cat Upd")
        
        # We need a valid category for Product tests
        r_cat = await client.get("/api/v1/admin/products/categories", headers=auth)
        valid_cat_id = r_cat.json()[0]["id"]
        
        await run_crud_suite("Products", "products", 
                             {"name": "Prod", "category_id": valid_cat_id}, 
                             {"name": "Prod Upd", "display_order": 5}, "name", "Prod Upd")
        
        await run_crud_suite("Services", "services", 
                             {"name": "Svc"}, 
                             {"name": "Svc Upd"}, "name", "Svc Upd")
                             
        await run_crud_suite("Industries", "industries", 
                             {"name": "Ind"}, 
                             {"name": "Ind Upd"}, "name", "Ind Upd")
                             
        await run_crud_suite("Training", "training", 
                             {"name": "Trn"}, 
                             {"name": "Trn Upd"}, "name", "Trn Upd")
        
        # Product Category Validations
        print("Testing specific Product/Category behaviors...")
        # Invalid Category ID on Product Create
        r = await client.post("/api/v1/admin/products", json={"name": "Inv", "slug": "inv", "category_id": invalid_uuid}, headers=auth)
        assert r.status_code == 422, f"Expected 422, got {r.status_code}"
        
        # Category Delete Protection
        r = await client.delete(f"/api/v1/admin/products/categories/{valid_cat_id}", headers=auth)
        assert r.status_code == 409
        
        # Public API Regressions
        print("Testing Public API Regressions...")
        endpoints = ["/api/v1/public/products/categories", "/api/v1/public/products", "/api/v1/public/services", 
                     "/api/v1/public/industries", "/api/v1/public/training", "/api/v1/public/about", "/api/v1/public/contact"]
        for ep in endpoints:
            assert (await client.get(ep)).status_code == 200
            
        print("ALL TESTS PASSED SUCCESSFULLY!")

asyncio.run(test_all())
