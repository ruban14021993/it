import asyncio
import os
import shutil
import uuid
from app.database import async_session
from app.models import MediaAsset, HomepageContent
from sqlalchemy import select

async def main():
    src_img = r"C:\Users\Ruban\.gemini\antigravity-ide\brain\c93bf557-ce8d-4acc-8c5f-980411e7c8a6\hero_banner_tech_1790419799231.jpg"
    from app.config import settings
    upload_dir = os.path.abspath(settings.UPLOAD_DIR)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}.jpg"
    dst_img = os.path.join(upload_dir, unique_filename)
    
    # Copy file
    shutil.copy(src_img, dst_img)
    print(f"Copied to {dst_img}")
    
    async with async_session() as session:
        # 1. Create Media Asset
        asset = MediaAsset(
            filename="hero_banner_tech.jpg",
            storage_path=f"/uploads/{unique_filename}",
            media_type="image",
            mime_type="image/jpeg",
            file_size=os.path.getsize(dst_img),
            width=1200,
            height=800,
        )
        session.add(asset)
        await session.commit()
        await session.refresh(asset)
        print(f"Created media asset: {asset.id}")
        
        # 2. Update Homepage Content
        result = await session.execute(select(HomepageContent).limit(1))
        hp = result.scalar_one_or_none()
        if hp:
            hp.image_id = asset.id
            await session.commit()
            print("Homepage updated successfully!")
        else:
            print("No homepage content found to update.")

if __name__ == "__main__":
    asyncio.run(main())
