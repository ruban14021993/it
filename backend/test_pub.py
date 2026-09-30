import asyncio
import httpx

async def test_pub():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        endpoints = ["/api/v1/public/home", "/api/v1/public/products", "/api/v1/public/services", 
                     "/api/v1/public/industries", "/api/v1/public/training", "/api/v1/public/about", "/api/v1/public/contact"]
        for ep in endpoints:
            r = await client.get(ep)
            assert r.status_code == 200, f"{ep} failed with {r.status_code}"
        print("Public endpoints ok")

asyncio.run(test_pub())
