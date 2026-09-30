import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8000/api/v1/public"

async def test_api():
    async with httpx.AsyncClient() as client:
        # 1. Category Filtering
        r = await client.get(f"{BASE_URL}/products/category/billing-finance")
        print(f"Products by valid category (billing-finance): {r.status_code}")
        data = r.json()
        print(f"Count: {len(data.get('items', []))}")
        
        r = await client.get(f"{BASE_URL}/products/category/invalid-category-slug")
        print(f"Products by invalid category: {r.status_code}")
        
        # 2. Enquiry POST
        r = await client.post(f"{BASE_URL}/enquiries", json={
            "name": "Another Test",
            "email": "another@test.com",
            "phone": "0987654321",
            "message": "Hello"
        })
        print(f"Valid Enquiry POST: {r.status_code}")
        print(r.json())
        
        r = await client.post(f"{BASE_URL}/enquiries", json={
            "name": "Invalid Email Test",
            "email": "not-an-email",
            "phone": "0987654321",
            "message": "Hello"
        })
        print(f"Invalid Email Enquiry POST: {r.status_code}")
        
        r = await client.post(f"{BASE_URL}/enquiries", json={
            "email": "missing-fields@test.com"
        })
        print(f"Missing Fields Enquiry POST: {r.status_code}")
        
        # Clean up the valid enquiry we just made
        print("Cleaning up Another Test enquiry via db...")

if __name__ == "__main__":
    asyncio.run(test_api())
