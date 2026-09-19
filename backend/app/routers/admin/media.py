import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import AdminUser, MediaAsset
from app.schemas import MediaAssetOut
from app.core.deps import get_current_admin
from app.config import settings

router = APIRouter(prefix="/media", tags=["Admin - Media"])

ALLOWED_TYPES = set(settings.ALLOWED_IMAGE_TYPES + settings.ALLOWED_VIDEO_TYPES)


@router.get("", response_model=list[MediaAssetOut])
async def list_media(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(
        select(MediaAsset).order_by(MediaAsset.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=MediaAssetOut, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file.content_type}' is not allowed.",
        )

    content = await file.read()
    size = len(content)
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if size > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE_MB}MB.",
        )

    ext = os.path.splitext(file.filename or "upload")[1].lower()
    unique_filename = f"{uuid.uuid4()}{ext}"
    upload_dir = os.path.abspath(settings.UPLOAD_DIR)
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_filename)

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    # Detect dimensions for images
    width = height = None
    media_type = "image" if file.content_type in settings.ALLOWED_IMAGE_TYPES else "video"
    if media_type == "image" and file.content_type != "image/svg+xml":
        try:
            from PIL import Image
            import io
            img = Image.open(io.BytesIO(content))
            width, height = img.size
        except Exception:
            pass

    asset = MediaAsset(
        filename=file.filename or unique_filename,
        storage_path=f"/uploads/{unique_filename}",
        media_type=media_type,
        mime_type=file.content_type or "application/octet-stream",
        file_size=size,
        width=width,
        height=height,
    )
    db.add(asset)
    await db.commit()
    await db.refresh(asset)
    return asset


@router.patch("/{asset_id}", response_model=MediaAssetOut)
async def update_media_alt(
    asset_id: str,
    alt_text: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(MediaAsset).where(MediaAsset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Media asset not found")
    asset.alt_text = alt_text
    await db.commit()
    await db.refresh(asset)
    return asset


@router.delete("/{asset_id}", status_code=204)
async def delete_media(
    asset_id: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(MediaAsset).where(MediaAsset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Media asset not found")

    # Remove physical file
    upload_dir = os.path.abspath(settings.UPLOAD_DIR)
    filename = os.path.basename(asset.storage_path)
    file_path = os.path.join(upload_dir, filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    await db.delete(asset)
    await db.commit()
