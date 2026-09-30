import httpx
import asyncio
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1/public"

async def test_endpoints():
    async with httpx.AsyncClient() as client:
        # Categories
        r = await client.get(f"{BASE_URL}/products/categories")
        print(f"Categories: {r.status_code}")
        cat_data = r.json()
        print(f"Categories count: {len(cat_data.get('items', []))}")
        
        # Products
        r = await client.get(f"{BASE_URL}/products")
        print(f"Products: {r.status_code}")
        prod_data = r.json()
        print(f"Products count: {len(prod_data.get('items', []))}")
        
        # Services
        r = await client.get(f"{BASE_URL}/services")
        print(f"Services: {r.status_code}")
        serv_data = r.json()
        print(f"Services count: {len(serv_data.get('items', []))}")
        
        # Industries
        r = await client.get(f"{BASE_URL}/industries")
        print(f"Industries: {r.status_code}")
        ind_data = r.json()
        print(f"Industries count: {len(ind_data.get('items', []))}")
        
        # Training
        r = await client.get(f"{BASE_URL}/training")
        print(f"Training: {r.status_code}")
        train_data = r.json()
        print(f"Training count: {len(train_data.get('items', []))}")
        
        # About
        r = await client.get(f"{BASE_URL}/about")
        print(f"About: {r.status_code}")
        
        # Contact
        r = await client.get(f"{BASE_URL}/contact")
        print(f"Contact: {r.status_code}")
        
        # Valid and Invalid slugs (using the first product slug if exists)
        if prod_data.get('items'):
            first_slug = prod_data['items'][0]['slug']
            r = await client.get(f"{BASE_URL}/products/{first_slug}")
            print(f"Valid Product Slug ({first_slug}): {r.status_code}")
            
        r = await client.get(f"{BASE_URL}/products/invalid-fake-slug")
        print(f"Invalid Product Slug: {r.status_code}")
        
        # Enquiry POST
        r = await client.post(f"{BASE_URL}/enquiries", json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "message": "This is a test message"
        })
        print(f"Enquiry POST: {r.status_code}")
        print(r.json())
        
        # OpenAPI
        r = await client.get("http://127.0.0.1:8000/api/docs")
        print(f"OpenAPI /docs: {r.status_code}")
        
        r = await client.get("http://127.0.0.1:8000/openapi.json")
        print(f"OpenAPI JSON: {r.status_code}")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
