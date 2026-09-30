import asyncio
import httpx

async def test_auth():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # Test Public
        r = await client.get("/api/v1/public/products")
        assert r.status_code == 200, "Public API failed"
        
        # Test Login
        r = await client.post("/api/v1/admin/auth/login", json={
            "email": "admin@infinitymindtech.com",
            "password": "ChangeMe123!"
        })
        assert r.status_code == 200, f"Login failed: {r.text}"
        token = r.json()["access_token"]
        
        # Test Me
        r = await client.get("/api/v1/admin/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200, f"Me failed: {r.text}"
        
        # Test Me Unauthorized
        r = await client.get("/api/v1/admin/auth/me")
        assert r.status_code == 403, "Me Unauthorized failed"
        
        print("ALL TESTS PASSED WITH HTTPX")

asyncio.run(test_auth())
