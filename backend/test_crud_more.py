import asyncio
import httpx
from app.config import settings

async def test_crud():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
        assert r.status_code == 200, "Login failed"
        headers = {"Authorization": f"Bearer {r.json()['access_token']}"}
        
        # Test Services
        r = await client.get("/api/v1/admin/services", headers=headers)
        assert r.status_code == 200, f"Service List failed: {r.text}"
        
        svc_data = {"name": "Test Service", "slug": "test-service"}
        r = await client.post("/api/v1/admin/services", json=svc_data, headers=headers)
        assert r.status_code == 201, f"Service Create failed: {r.text}"
        svc_id = r.json()["id"]
        
        r = await client.put(f"/api/v1/admin/services/{svc_id}", json={"name": "Test Service Updated"}, headers=headers)
        assert r.status_code == 200, f"Service Update failed: {r.text}"
        
        r = await client.delete(f"/api/v1/admin/services/{svc_id}", headers=headers)
        assert r.status_code == 204, f"Service Delete failed: {r.text}"

        # Test Industries
        r = await client.get("/api/v1/admin/industries", headers=headers)
        assert r.status_code == 200, f"Industry List failed: {r.text}"
        
        ind_data = {"name": "Test Industry", "slug": "test-industry"}
        r = await client.post("/api/v1/admin/industries", json=ind_data, headers=headers)
        assert r.status_code == 201, f"Industry Create failed: {r.text}"
        ind_id = r.json()["id"]
        
        r = await client.put(f"/api/v1/admin/industries/{ind_id}", json={"name": "Test Industry Updated"}, headers=headers)
        assert r.status_code == 200, f"Industry Update failed: {r.text}"
        
        r = await client.delete(f"/api/v1/admin/industries/{ind_id}", headers=headers)
        assert r.status_code == 204, f"Industry Delete failed: {r.text}"

        # Test Training
        r = await client.get("/api/v1/admin/training", headers=headers)
        assert r.status_code == 200, f"Training List failed: {r.text}"
        
        trn_data = {"name": "Test Training", "slug": "test-training"}
        r = await client.post("/api/v1/admin/training", json=trn_data, headers=headers)
        assert r.status_code == 201, f"Training Create failed: {r.text}"
        trn_id = r.json()["id"]
        
        r = await client.put(f"/api/v1/admin/training/{trn_id}", json={"name": "Test Training Updated"}, headers=headers)
        assert r.status_code == 200, f"Training Update failed: {r.text}"
        
        r = await client.delete(f"/api/v1/admin/training/{trn_id}", headers=headers)
        assert r.status_code == 204, f"Training Delete failed: {r.text}"

        print("ALL TESTS PASSED")

asyncio.run(test_crud())
