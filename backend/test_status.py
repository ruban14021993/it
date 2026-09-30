import asyncio
import httpx

async def test():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        r = await client.get("/api/v1/admin/auth/me")
        print(f"Status: {r.status_code}")

asyncio.run(test())
