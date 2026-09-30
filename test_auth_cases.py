import httpx
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

def run_tests():
    email = os.getenv('ADMIN_EMAIL')
    password = os.getenv('ADMIN_PASSWORD')
    url = "http://127.0.0.1:8000/api/v1/admin/auth/login"
    
    # Wrong password
    r1 = httpx.post(url, json={"email": email, "password": "wrong"})
    print(f"Wrong password: {r1.status_code}")
    
    # Unknown email
    r2 = httpx.post(url, json={"email": "unknown@example.com", "password": password})
    print(f"Unknown email: {r2.status_code}")
    
    # Missing credentials
    r3 = httpx.post(url, json={})
    print(f"Missing credentials: {r3.status_code}")

run_tests()
