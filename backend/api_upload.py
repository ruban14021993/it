import json
import urllib.request
import urllib.parse

url_base = "http://127.0.0.1:8000/api/v1/admin"
email = "admin@infinitymindtech.com"
password = "Admin_b281f83d!2026"
image_path = r"C:\Users\Ruban\.gemini\antigravity-ide\brain\c93bf557-ce8d-4acc-8c5f-980411e7c8a6\hero_banner_tech_1790419799231.jpg"

print("Logging in...")
data = json.dumps({"email": email, "password": password}).encode("utf-8")
req = urllib.request.Request(f"{url_base}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
with urllib.request.urlopen(req) as res:
    token = json.loads(res.read().decode("utf-8"))["access_token"]

print("Token acquired.")

print("Uploading image...")
boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = bytearray()
body.extend(f"--{boundary}\r\n".encode("utf-8"))
body.extend(b'Content-Disposition: form-data; name="file"; filename="hero_banner_tech.jpg"\r\n')
body.extend(b'Content-Type: image/jpeg\r\n\r\n')
with open(image_path, "rb") as f:
    body.extend(f.read())
body.extend(f"\r\n--{boundary}--\r\n".encode("utf-8"))

req = urllib.request.Request(f"{url_base}/media", data=body)
req.add_header("Authorization", f"Bearer {token}")
req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

try:
    with urllib.request.urlopen(req) as res:
        asset_id = json.loads(res.read().decode("utf-8"))["id"]
        print(f"Uploaded asset ID: {asset_id}")
except Exception as e:
    print("Upload failed:", e.read().decode("utf-8") if hasattr(e, 'read') else e)
    exit(1)

print("Fetching homepage content...")
req = urllib.request.Request(f"{url_base}/homepage")
req.add_header("Authorization", f"Bearer {token}")
with urllib.request.urlopen(req) as res:
    hp_data = json.loads(res.read().decode("utf-8"))

print("Updating homepage...")
hp_data["image_id"] = asset_id
hp_data["is_active"] = hp_data.get("is_active", True)

data = json.dumps(hp_data).encode("utf-8")
req = urllib.request.Request(f"{url_base}/homepage", data=data, method="PUT")
req.add_header("Authorization", f"Bearer {token}")
req.add_header("Content-Type", "application/json")
with urllib.request.urlopen(req) as res:
    print("Successfully set the hero image!")
