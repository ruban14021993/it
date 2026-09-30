from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import AdminUser
from app.core.deps import get_current_admin
from app.controllers.admin_content import AdminEnquiryController
from app.schemas.admin_content import EnquiryResponse, EnquiryUpdate

router = APIRouter(prefix="/enquiries", tags=["Admin - Enquiries"])

@router.get("", response_model=List[EnquiryResponse])
async def list_enquiries(db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminEnquiryController(db).list_all()

@router.get("/{id}", response_model=EnquiryResponse)
async def get_enquiry(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminEnquiryController(db).get_by_id(id)

@router.put("/{id}", response_model=EnquiryResponse)
async def update_enquiry(id: str, data: EnquiryUpdate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminEnquiryController(db).update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enquiry(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    await AdminEnquiryController(db).delete(id)
