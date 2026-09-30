from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import AdminUser
from app.core.deps import get_current_admin
from app.controllers.admin_content import AdminAboutController
from app.schemas.admin_content import AboutResponse, AboutUpdate

router = APIRouter(prefix="/about", tags=["Admin - About"])

@router.get("", response_model=AboutResponse)
async def get_about(db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminAboutController(db).get_content()

@router.put("", response_model=AboutResponse)
async def update_about(data: AboutUpdate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminAboutController(db).update_content(data)
