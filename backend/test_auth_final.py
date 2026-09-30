import httpx
import os
from dotenv import load_dotenv
load_dotenv('.env')

def run_tests():
    email = os.getenv('ADMIN_EMAIL')
    password = os.getenv('ADMIN_PASSWORD')
    url = "http://127.0.0.1:8000/api/v1/admin/auth/login"
    r = httpx.post(url, json={"email": email, "password": password}, timeout=15.0)
    print(f"Login: {'PASS' if r.status_code == 200 else 'FAIL (' + str(r.status_code) + ')'}")
    
    if r.status_code == 200:
        token = r.json().get('access_token')
        me_r = httpx.get("http://127.0.0.1:8000/api/v1/admin/auth/me", headers={"Authorization": f"Bearer {token}"})
        print(f"/me: {'PASS' if me_r.status_code == 200 else 'FAIL (' + str(me_r.status_code) + ')'}")
run_tests()
