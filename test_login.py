import httpx
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

def test_login():
    email = os.getenv('ADMIN_EMAIL')
    password = os.getenv('ADMIN_PASSWORD')
    
    # Use the docker exposed port
    url = "http://127.0.0.1:8000/api/v1/admin/auth/login"
    payload = {"email": email, "password": password}
    print(f"Testing login for {email}...")
    
    r = httpx.post(url, json=payload)
    print(f"Status Code: {r.status_code}")
    if r.status_code == 200:
        print("Login successful.")
        token = r.json().get('access_token')
        # test /me
        me_r = httpx.get("http://127.0.0.1:8000/api/v1/admin/auth/me", headers={"Authorization": f"Bearer {token}"})
        print(f"/me Status Code: {me_r.status_code}")
        if me_r.status_code == 200:
            print("Auth me successful.")
    else:
        print(r.text)

test_login()
