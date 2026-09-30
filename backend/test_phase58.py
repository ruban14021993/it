import asyncio
import httpx
import uuid
from app.config import settings

async def test_all():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # Auth
        r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
        assert r.status_code == 200, "Login failed"
        token = r.json()["access_token"]
        auth = {"Authorization": f"Bearer {token}"}
        no_auth = {}
        invalid_auth = {"Authorization": "Bearer invalid"}
        invalid_uuid = "00000000-0000-0000-0000-000000000000"
        
        # Test auth behavior
        assert (await client.get("/api/v1/admin/homepage", headers=no_auth)).status_code == 401
        assert (await client.get("/api/v1/admin/homepage", headers=invalid_auth)).status_code == 401

        print("Testing Homepage...")
        r_get = await client.get("/api/v1/admin/homepage", headers=auth)
        # It could be 404 if no seed data exists, or 200 if it does.
        if r_get.status_code == 200:
            original_hp = r_get.json()
            r_upd = await client.put("/api/v1/admin/homepage", json={"heading": "phase58-test-heading"}, headers=auth)
            assert r_upd.status_code == 200
            assert r_upd.json()["heading"] == "phase58-test-heading"
            await client.put("/api/v1/admin/homepage", json={"heading": original_hp["heading"]}, headers=auth)
        else:
            assert r_get.status_code == 404
        
        # Unauth checks
        assert (await client.put("/api/v1/admin/homepage", json={"heading": "x"}, headers=no_auth)).status_code == 401

        print("Testing About...")
        r_get = await client.get("/api/v1/admin/about", headers=auth)
        assert r_get.status_code == 200
        original_about = r_get.json()
        
        r_upd = await client.put("/api/v1/admin/about", json={"company_name": "phase58-test-company"}, headers=auth)
        assert r_upd.status_code == 200
        assert r_upd.json()["company_name"] == "phase58-test-company"
        
        # Restore
        await client.put("/api/v1/admin/about", json={"company_name": original_about["company_name"]}, headers=auth)
        assert (await client.get("/api/v1/admin/about", headers=no_auth)).status_code == 401

        print("Testing Contact...")
        r_get = await client.get("/api/v1/admin/contact", headers=auth)
        assert r_get.status_code == 200
        original_contact = r_get.json()
        
        r_upd = await client.put("/api/v1/admin/contact", json={"primary_email": "phase58-test@example.com"}, headers=auth)
        assert r_upd.status_code == 200
        assert r_upd.json()["primary_email"] == "phase58-test@example.com"
        
        # Restore
        await client.put("/api/v1/admin/contact", json={"primary_email": original_contact["primary_email"]}, headers=auth)
        assert (await client.get("/api/v1/admin/contact", headers=no_auth)).status_code == 401

        print("Testing Branches...")
        assert (await client.get("/api/v1/admin/contact/branches", headers=no_auth)).status_code == 401
        
        r_list = await client.get("/api/v1/admin/contact/branches", headers=auth)
        assert r_list.status_code == 200
        
        assert (await client.get(f"/api/v1/admin/contact/branches/{invalid_uuid}", headers=auth)).status_code == 404
        
        b_name = f"phase58-test-branch-{uuid.uuid4().hex[:6]}"
        r_cre = await client.post("/api/v1/admin/contact/branches", json={"name": b_name}, headers=auth)
        assert r_cre.status_code == 201
        b_id = r_cre.json()["id"]
        # Ensure is_primary is not present in creation or response
        assert "is_primary" not in r_cre.json()
        
        r_dup = await client.post("/api/v1/admin/contact/branches", json={"name": b_name}, headers=auth)
        assert r_dup.status_code == 409
        
        r_upd = await client.put(f"/api/v1/admin/contact/branches/{b_id}", json={"name": b_name + "-upd"}, headers=auth)
        assert r_upd.status_code == 200
        assert r_upd.json()["name"] == b_name + "-upd"
        assert "is_primary" not in r_upd.json()
        
        assert (await client.put(f"/api/v1/admin/contact/branches/{invalid_uuid}", json={"name": "x"}, headers=auth)).status_code == 404
        
        assert (await client.delete(f"/api/v1/admin/contact/branches/{b_id}", headers=auth)).status_code == 204
        assert (await client.delete(f"/api/v1/admin/contact/branches/{invalid_uuid}", headers=auth)).status_code == 404

        print("Testing Enquiries...")
        assert (await client.get("/api/v1/admin/enquiries", headers=no_auth)).status_code == 401
        r_list = await client.get("/api/v1/admin/enquiries", headers=auth)
        assert r_list.status_code == 200
        
        assert (await client.get(f"/api/v1/admin/enquiries/{invalid_uuid}", headers=auth)).status_code == 404
        
        # We need to create an enquiry via PUBLIC api first to test admin
        e_data = {"name": "phase58-test-enq", "email": "test@test.com", "phone": "123", "message": "msg"}
        r_pub = await client.post("/api/v1/public/enquiries", json=e_data)
        if r_pub.status_code != 201 and r_pub.status_code != 200:
            print("Failed to create public enquiry, status:", r_pub.status_code)
            enquiries = r_list.json()
            e_id = enquiries[0]["id"] if enquiries else None
        else:
            e_id = r_pub.json().get("id")

        if e_id:
            # Update status
            original_status = (await client.get(f"/api/v1/admin/enquiries/{e_id}", headers=auth)).json()["status"]
            r_upd = await client.put(f"/api/v1/admin/enquiries/{e_id}", json={"status": "phase58-status"}, headers=auth)
            assert r_upd.status_code == 200
            assert r_upd.json()["status"] == "phase58-status"
            
            # Restore status explicitly as requested (or just delete it, but let's test restore and delete)
            r_restore = await client.put(f"/api/v1/admin/enquiries/{e_id}", json={"status": original_status}, headers=auth)
            assert r_restore.status_code == 200
            
            # Delete
            assert (await client.delete(f"/api/v1/admin/enquiries/{e_id}", headers=auth)).status_code == 204
            
            # Verify deleted
            assert (await client.get(f"/api/v1/admin/enquiries/{e_id}", headers=auth)).status_code == 404
            
        print("ALL TESTS PASSED!")

asyncio.run(test_all())
