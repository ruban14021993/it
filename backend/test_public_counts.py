import asyncio
import httpx

async def verify_public():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        r = await client.get("/api/v1/public/products/categories")
        print(f"Categories: {len(r.json()['items'])}")
        
        r = await client.get("/api/v1/public/products")
        print(f"Products: {len(r.json()['items'])}")
        
        r = await client.get("/api/v1/public/services")
        print(f"Services: {len(r.json()['items'])}")
        
        r = await client.get("/api/v1/public/industries")
        print(f"Industries: {len(r.json()['items'])}")
        
        r = await client.get("/api/v1/public/training")
        print(f"Training: {len(r.json()['items'])}")
        
        r = await client.get("/api/v1/public/contact")
        print(f"Branches: {len(r.json()['item']['branches'])}")

asyncio.run(verify_public())
