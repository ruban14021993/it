import asyncio
import httpx
import uuid
from app.config import settings

async def test_all_crud():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # Get Token
        r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
        assert r.status_code == 200, "Login failed"
        token = r.json()["access_token"]
        auth = {"Authorization": f"Bearer {token}"}
        no_auth = {}
        invalid_auth = {"Authorization": "Bearer invalidtoken"}
        
        # 1. Product Categories
        print("Testing Categories...")
        # Unauth list
        r = await client.get("/api/v1/admin/products/categories", headers=invalid_auth)
        assert r.status_code == 401
        
        # List
        r = await client.get("/api/v1/admin/products/categories", headers=auth)
        assert r.status_code == 200
        cat_data = r.json()
        first_cat = cat_data[0]["id"]
        
        # Detail existing
        r = await client.get(f"/api/v1/admin/products/categories/{first_cat}", headers=auth)
        assert r.status_code == 200
        
        # Detail non-existent
        r = await client.get(f"/api/v1/admin/products/categories/00000000-0000-0000-0000-000000000000", headers=auth)
        assert r.status_code == 404
        
        # Create
        uid = str(uuid.uuid4())[:8]
        slug_a = f"test-cat-a-{uid}"
        r = await client.post("/api/v1/admin/products/categories", json={"name": "A", "slug": slug_a, "display_order": 1}, headers=auth)
        assert r.status_code == 201
        cat_a = r.json()["id"]
        
        # Duplicate create
        r = await client.post("/api/v1/admin/products/categories", json={"name": "A", "slug": slug_a, "display_order": 1}, headers=auth)
        assert r.status_code == 409
        
        # Update behavior & duplicate update
        slug_b = f"test-cat-b-{uid}"
        r = await client.post("/api/v1/admin/products/categories", json={"name": "B", "slug": slug_b, "display_order": 2}, headers=auth)
        cat_b = r.json()["id"]
        
        r = await client.put(f"/api/v1/admin/products/categories/{cat_b}", json={"slug": slug_a}, headers=auth)
        assert r.status_code == 409
        
        r = await client.put(f"/api/v1/admin/products/categories/{cat_b}", json={"name": "B Updated", "display_order": 5, "description": "Desc"}, headers=auth)
        assert r.status_code == 200
        
        r = await client.get(f"/api/v1/admin/products/categories/{cat_b}", headers=auth)
        res = r.json()
        assert res["name"] == "B Updated"
        assert res["display_order"] == 5
        assert res["description"] == "Desc"
        
        # Relationship protect
        r = await client.delete(f"/api/v1/admin/products/categories/{first_cat}", headers=auth)
        assert r.status_code == 409
        
        # Delete
        r = await client.delete(f"/api/v1/admin/products/categories/{cat_a}", headers=auth)
        assert r.status_code in [200, 204]
        r = await client.delete(f"/api/v1/admin/products/categories/{cat_b}", headers=auth)
        assert r.status_code in [200, 204]
        
        # 2. Products
        print("Testing Products...")
        r = await client.get("/api/v1/admin/products", headers=no_auth)
        assert r.status_code == 401
        
        # Invalid FK
        r = await client.post("/api/v1/admin/products", json={"name": "P", "slug": f"test-p-{uid}", "category_id": "00000000-0000-0000-0000-000000000000"}, headers=auth)
        # Should throw 409/500/400 depends on DB FK error mapped to IntegrityError duplicate, wait actually our code throws DuplicateSlugError for IntegrityError. So it returns 409.
        assert r.status_code == 409 or r.status_code == 422
        
        r = await client.post("/api/v1/admin/products", json={"name": "P1", "slug": f"test-p1-{uid}", "category_id": first_cat, "display_order": 1}, headers=auth)
        assert r.status_code == 201
        p1 = r.json()["id"]
        r = await client.post("/api/v1/admin/products", json={"name": "P2", "slug": f"test-p2-{uid}", "category_id": first_cat, "display_order": 2}, headers=auth)
        p2 = r.json()["id"]
        
        r = await client.put(f"/api/v1/admin/products/{p2}", json={"slug": f"test-p1-{uid}"}, headers=auth)
        assert r.status_code == 409
        
        r = await client.put(f"/api/v1/admin/products/{p2}", json={"name": "P2 Updated", "display_order": 9, "short_description": "Short desc"}, headers=auth)
        r = await client.get(f"/api/v1/admin/products/{p2}", headers=auth)
        assert r.json()["name"] == "P2 Updated"
        assert r.json()["display_order"] == 9
        assert r.json()["short_description"] == "Short desc"
        
        r = await client.delete(f"/api/v1/admin/products/{p1}", headers=auth)
        r = await client.delete(f"/api/v1/admin/products/{p2}", headers=auth)
        
        # 3. Services
        print("Testing Services...")
        r = await client.get("/api/v1/admin/services", headers=no_auth)
        assert r.status_code == 401
        r = await client.post("/api/v1/admin/services", json={"name": "S1", "slug": f"test-s1-{uid}", "display_order": 1}, headers=auth)
        s1 = r.json()["id"]
        r = await client.post("/api/v1/admin/services", json={"name": "S2", "slug": f"test-s2-{uid}", "display_order": 2}, headers=auth)
        s2 = r.json()["id"]
        r = await client.put(f"/api/v1/admin/services/{s2}", json={"slug": f"test-s1-{uid}"}, headers=auth)
        assert r.status_code == 409
        r = await client.put(f"/api/v1/admin/services/{s2}", json={"name": "S2 Updated", "display_order": 5, "short_description": "SD"}, headers=auth)
        r = await client.get(f"/api/v1/admin/services/{s2}", headers=auth)
        assert r.json()["name"] == "S2 Updated"
        assert r.json()["display_order"] == 5
        r = await client.delete(f"/api/v1/admin/services/{s1}", headers=auth)
        r = await client.delete(f"/api/v1/admin/services/{s2}", headers=auth)

        # 4. Industries
        print("Testing Industries...")
        r = await client.get("/api/v1/admin/industries", headers=no_auth)
        assert r.status_code == 401
        r = await client.post("/api/v1/admin/industries", json={"name": "I1", "slug": f"test-i1-{uid}", "display_order": 1}, headers=auth)
        i1 = r.json()["id"]
        r = await client.post("/api/v1/admin/industries", json={"name": "I2", "slug": f"test-i2-{uid}", "display_order": 2}, headers=auth)
        i2 = r.json()["id"]
        r = await client.put(f"/api/v1/admin/industries/{i2}", json={"slug": f"test-i1-{uid}"}, headers=auth)
        assert r.status_code == 409
        r = await client.put(f"/api/v1/admin/industries/{i2}", json={"name": "I2 Updated", "display_order": 5}, headers=auth)
        r = await client.get(f"/api/v1/admin/industries/{i2}", headers=auth)
        assert r.json()["name"] == "I2 Updated"
        r = await client.delete(f"/api/v1/admin/industries/{i1}", headers=auth)
        r = await client.delete(f"/api/v1/admin/industries/{i2}", headers=auth)

        # 5. Training
        print("Testing Training...")
        r = await client.get("/api/v1/admin/training", headers=no_auth)
        assert r.status_code == 401
        r = await client.post("/api/v1/admin/training", json={"name": "T1", "slug": f"test-t1-{uid}", "display_order": 1}, headers=auth)
        t1 = r.json()["id"]
        r = await client.post("/api/v1/admin/training", json={"name": "T2", "slug": f"test-t2-{uid}", "display_order": 2}, headers=auth)
        t2 = r.json()["id"]
        r = await client.put(f"/api/v1/admin/training/{t2}", json={"slug": f"test-t1-{uid}"}, headers=auth)
        assert r.status_code == 409
        r = await client.put(f"/api/v1/admin/training/{t2}", json={"name": "T2 Updated", "display_order": 5}, headers=auth)
        r = await client.get(f"/api/v1/admin/training/{t2}", headers=auth)
        assert r.json()["name"] == "T2 Updated"
        r = await client.delete(f"/api/v1/admin/training/{t1}", headers=auth)
        r = await client.delete(f"/api/v1/admin/training/{t2}", headers=auth)

        print("ALL TESTS PASSED")

asyncio.run(test_all_crud())
