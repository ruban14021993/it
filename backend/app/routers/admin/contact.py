from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import AdminUser
from app.core.deps import get_current_admin
from app.controllers.admin_content import AdminContactController
from app.schemas.admin_content import ContactResponse, ContactUpdate

router = APIRouter(prefix="/contact", tags=["Admin - Contact"])

@router.get("", response_model=ContactResponse)
async def get_contact(db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminContactController(db).get_content()

@router.put("", response_model=ContactResponse)
async def update_contact(data: ContactUpdate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminContactController(db).update_content(data)
