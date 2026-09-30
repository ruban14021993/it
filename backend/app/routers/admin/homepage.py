from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import AdminUser
from app.core.deps import get_current_admin
from app.controllers.admin_content import AdminHomepageController
from app.schemas.admin_content import HomepageResponse, HomepageUpdate

router = APIRouter(prefix="/homepage", tags=["Admin - Homepage"])

@router.get("", response_model=HomepageResponse)
async def get_homepage(db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminHomepageController(db).get_content()

@router.put("", response_model=HomepageResponse)
async def update_homepage(data: HomepageUpdate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminHomepageController(db).update_content(data)
