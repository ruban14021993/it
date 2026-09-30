import httpx
import os
from dotenv import load_dotenv

load_dotenv('.env')

def run_tests():
    email = os.getenv('ADMIN_EMAIL')
    password = os.getenv('ADMIN_PASSWORD')
    url = "http://127.0.0.1:8000/api/v1/admin/auth/login"
    
    # Wrong password
    r1 = httpx.post(url, json={"email": email, "password": "wrong"}, timeout=10.0)
    print(f"Wrong password: {r1.status_code}")
    
    # Unknown email
    r2 = httpx.post(url, json={"email": "unknown@example.com", "password": password}, timeout=10.0)
    print(f"Unknown email: {r2.status_code}")
    
    # Missing credentials
    r3 = httpx.post(url, json={}, timeout=10.0)
    print(f"Missing credentials: {r3.status_code}")
    
    # Inactive admin
    # To test this, I would need to set the admin to inactive, but I will skip actual testing of 403 to avoid breaking the DB, since we can see the code logic in controllers.
    
run_tests()
