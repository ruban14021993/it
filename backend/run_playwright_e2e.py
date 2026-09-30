import asyncio
from playwright.async_api import async_playwright
import httpx
from app.config import settings
import json

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Step 1: Login
        print("Logging into Admin UI...")
        await page.goto("http://localhost:3000/admin/login")
        await page.fill("input[type='email']", settings.ADMIN_EMAIL)
        await page.fill("input[type='password']", settings.ADMIN_PASSWORD)
        await page.click("button[type='submit']")
        await page.wait_for_url("http://localhost:3000/admin")

        # Step 2: Navigate to Products
        print("Navigating to Products...")
        await page.goto("http://localhost:3000/admin/products")
        await page.wait_for_selector("table")

        # Open Edit Modal for CocoCraft
        print("Opening CocoCraft edit modal...")
        # Find the row for CocoCraft and click its Edit button
        # The table has CocoCraft in it. We can just search for the row containing 'CocoCraft' or 'cococraft'
        row = page.locator("tr", has_text="CocoCraft")
        await row.locator("button.text-blue-600").click()

        # Wait for modal to open (look for 'Edit Product' or the basic tab)
        await page.wait_for_selector("text=Basic Info")

        # Save Original Values via API to restore later
        async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
            r = await client.post("/api/v1/admin/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
            token = r.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            r = await client.get("/api/v1/admin/products", headers=headers)
            products = r.json()
            cococraft = next(p for p in products if p['slug'] == 'cococraft')
            original_features = cococraft.get("features", [])
            original_benefits = cococraft.get("benefits", [])
            original_cta_text = cococraft.get("cta_text", "")
            original_cta_url = cococraft.get("cta_url", "")
            cococraft_id = cococraft['id']

        # Step 3: Go to Features & CTA Tab
        print("Entering Features & CTA...")
        await page.click("button:has-text('Features & CTA')")
        
        # We need to fill the textareas.
        # Find the textareas. They have labels "Features (One per line)" and "Benefits (One per line)"
        # We can find them by placeholder or previous label.
        
        # Features textarea
        await page.fill("textarea[placeholder*='Feature 1']", "E2E Browser Feature One\nE2E Browser Feature Two")
        
        # Benefits textarea
        await page.fill("textarea[placeholder*='Benefit 1']", "E2E Browser Benefit One\nE2E Browser Benefit Two")
        
        # CTA Text input
        await page.fill("input[placeholder='e.g. Request Demo']", "E2E Browser CTA")
        
        # CTA URL input
        await page.fill("input[placeholder='e.g. /contact']", "/contact")

        # Save Product
        print("Saving product...")
        await page.click("button:has-text('Save Product')")

        # Wait for modal to close (or toast)
        await page.wait_for_selector("text=Product saved successfully")

        # Step 4: Admin Persistence
        print("Verifying Admin Persistence...")
        await page.reload()
        await page.wait_for_selector("table")
        row = page.locator("tr", has_text="CocoCraft")
        await row.locator("button.text-blue-600").click()
        await page.wait_for_selector("text=Basic Info")
        await page.click("button:has-text('Features & CTA')")
        
        # Check values
        features_val = await page.locator("textarea[placeholder*='Feature 1']").input_value()
        benefits_val = await page.locator("textarea[placeholder*='Benefit 1']").input_value()
        cta_text_val = await page.locator("input[placeholder='e.g. Request Demo']").input_value()
        cta_url_val = await page.locator("input[placeholder='e.g. /contact']").input_value()
        
        assert "E2E Browser Feature One" in features_val
        assert "E2E Browser Benefit One" in benefits_val
        assert "E2E Browser CTA" == cta_text_val
        assert "/contact" == cta_url_val
        print("Admin Persistence: PASS")
        
        # Step 5: Public API Reflection
        print("Verifying Public API Reflection...")
        async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
            r = await client.get("/api/v1/public/products/cococraft")
            pub_data = r.json()["item"]
            assert "E2E Browser Feature One" in pub_data["features"]
            assert "E2E Browser Benefit One" in pub_data["benefits"]
            assert pub_data["cta_text"] == "E2E Browser CTA"
            print("Public API Reflection: PASS")

        # Step 6: Public Browser Rendering
        print("Verifying Public Browser Rendering...")
        await page.goto("http://localhost:3000/products/cococraft")
        await page.wait_for_load_state("networkidle")
        
        html = await page.content()
        assert "E2E Browser Feature One" in html
        assert "E2E Browser Benefit One" in html
        assert "E2E Browser CTA" in html
        assert "Advanced capability designed" not in html
        assert "Experience a paradigm shift" not in html
        
        print("Public Browser Rendering: PASS")
        
        # Restore original values
        print("Restoring original values via API to save time (or via browser if needed)...")
        cococraft["features"] = original_features
        cococraft["benefits"] = original_benefits
        cococraft["cta_text"] = original_cta_text
        cococraft["cta_url"] = original_cta_url
        async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
            await client.put(f"/api/v1/admin/products/{cococraft_id}", headers=headers, json=cococraft)
        print("Original values restored")
        
        # Verify restoration on public page
        await page.goto("http://localhost:3000/products/cococraft")
        await page.wait_for_load_state("networkidle")
        html_restored = await page.content()
        assert "E2E Browser Feature One" not in html_restored
        print("Restoration Verified: PASS")

        await browser.close()

asyncio.run(run())
