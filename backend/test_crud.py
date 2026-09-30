import asyncio
import httpx
from app.config import settings
import uuid

async def test_crud():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # Get Token
        r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
        assert r.status_code == 200, "Login failed"
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test Category List
        r = await client.get("/api/v1/admin/products/categories", headers=headers)
        assert r.status_code == 200, "Category List failed"
        first_cat = r.json()[0]["id"]
        
        # Test Category Detail
        r = await client.get(f"/api/v1/admin/products/categories/{first_cat}", headers=headers)
        assert r.status_code == 200, "Category Detail failed"
        
        # Test Not Found
        r = await client.get(f"/api/v1/admin/products/categories/00000000-0000-0000-0000-000000000000", headers=headers)
        assert r.status_code == 404, "Category Not Found failed"
        
        # Test Create
        cat_slug = f"test-cat-{uuid.uuid4()}"
        cat_data = {"name": "Test Cat", "slug": cat_slug, "display_order": 99}
        r = await client.post("/api/v1/admin/products/categories", json=cat_data, headers=headers)
        assert r.status_code == 201, f"Category Create failed: {r.status_code}"
        new_cat_id = r.json()["id"]
        
        # Test Duplicate Slug
        r = await client.post("/api/v1/admin/products/categories", json=cat_data, headers=headers)
        assert r.status_code == 409, f"Category Duplicate Slug failed: {r.status_code}"
        
        # Test Update
        cat_update = {"name": "Test Cat Updated"}
        r = await client.put(f"/api/v1/admin/products/categories/{new_cat_id}", json=cat_update, headers=headers)
        assert r.status_code == 200, f"Category Update failed: {r.status_code}"
        assert r.json()["name"] == "Test Cat Updated"
        
        # Test Relationship Conflict (try deleting a seeded category that has products)
        r = await client.delete(f"/api/v1/admin/products/categories/{first_cat}", headers=headers)
        assert r.status_code == 409, f"Category Dependency Check failed: {r.status_code}"
        
        # Test Delete
        r = await client.delete(f"/api/v1/admin/products/categories/{new_cat_id}", headers=headers)
        assert r.status_code == 204, f"Category Delete failed: {r.status_code}"
        
        # Test Unauthorized
        r = await client.get("/api/v1/admin/products")
        assert r.status_code == 401, "Unauthorized failed"
        
        # Test Product CRUD
        prod_slug = f"test-prod-{uuid.uuid4()}"
        prod_data = {"name": "Test Prod", "slug": prod_slug, "category_id": first_cat}
        r = await client.post("/api/v1/admin/products", json=prod_data, headers=headers)
        assert r.status_code == 201, f"Product Create failed: {r.text}"
        new_prod_id = r.json()["id"]
        
        r = await client.delete(f"/api/v1/admin/products/{new_prod_id}", headers=headers)
        assert r.status_code == 204, "Product Delete failed"
        
        # Test Public API
        r = await client.get("/api/v1/public/products")
        assert r.status_code == 200, "Public API failed"
        
        print("ALL TESTS PASSED")

asyncio.run(test_crud())
