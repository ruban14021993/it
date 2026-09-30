import asyncio
import httpx
from datetime import timedelta

from sqlalchemy import text
from app.database import AsyncSessionLocal
from app.config import settings
from app.core.security import create_access_token
from app.models import AdminUser

async def run_tests():
    matrix = []
    
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
        matrix.append({"Test": "Valid login", "Expected": 200, "Actual": r.status_code, "Result": "PASS" if r.status_code == 200 else "FAIL"})
        token = r.json()["access_token"] if r.status_code == 200 else ""
        
        r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": "wrong"})
        matrix.append({"Test": "Wrong password", "Expected": 401, "Actual": r.status_code, "Result": "PASS" if r.status_code == 401 else "FAIL"})
        
        r = await client.post("/api/v1/admin/auth/login", json={"email": "unknown@example.com", "password": "wrong"})
        matrix.append({"Test": "Unknown email", "Expected": 401, "Actual": r.status_code, "Result": "PASS" if r.status_code == 401 else "FAIL"})
        
        r = await client.get("/api/v1/admin/auth/me")
        matrix.append({"Test": "Missing token", "Expected": 401, "Actual": r.status_code, "Result": "PASS" if r.status_code == 401 else "FAIL"})
        
        r = await client.get("/api/v1/admin/auth/me", headers={"Authorization": "Bearer malformed_token"})
        matrix.append({"Test": "Malformed token", "Expected": 401, "Actual": r.status_code, "Result": "PASS" if r.status_code == 401 else "FAIL"})
        
        r = await client.get("/api/v1/admin/auth/me", headers={"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"})
        matrix.append({"Test": "Invalid JWT", "Expected": 401, "Actual": r.status_code, "Result": "PASS" if r.status_code == 401 else "FAIL"})
        
        expired_token = create_access_token(data={"sub": "123"}, expires_delta=timedelta(minutes=-1))
        r = await client.get("/api/v1/admin/auth/me", headers={"Authorization": f"Bearer {expired_token}"})
        matrix.append({"Test": "Expired JWT", "Expected": 401, "Actual": r.status_code, "Result": "PASS" if r.status_code == 401 else "FAIL"})
        
        r = await client.get("/api/v1/admin/auth/me", headers={"Authorization": f"Bearer {token}"})
        matrix.append({"Test": "Active admin /me", "Expected": 200, "Actual": r.status_code, "Result": "PASS" if r.status_code == 200 else "FAIL"})
        
        async with AsyncSessionLocal() as db:
            await db.execute(text(f"UPDATE admin_users SET is_active = false WHERE email = '{settings.ADMIN_EMAIL}'"))
            await db.commit()
            
            r = await client.get("/api/v1/admin/auth/me", headers={"Authorization": f"Bearer {token}"})
            matrix.append({"Test": "Inactive admin /me", "Expected": 403, "Actual": r.status_code, "Result": "PASS" if r.status_code == 403 else "FAIL"})
            
            await db.execute(text(f"UPDATE admin_users SET is_active = true WHERE email = '{settings.ADMIN_EMAIL}'"))
            await db.commit()
            
    print("| Test | Expected | Actual | Result |")
    print("| --- | ---: | ---: | --- |")
    for row in matrix:
        print(f"| {row['Test']} | {row['Expected']} | {row['Actual']} | {row['Result']} |")

asyncio.run(run_tests())
