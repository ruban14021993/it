from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import AdminUser
from app.core.deps import get_current_admin
from app.controllers.admin_content import AdminBranchController
from app.schemas.admin_content import BranchResponse, BranchCreate, BranchUpdate

router = APIRouter(prefix="/contact/branches", tags=["Admin - Branches"])

@router.get("", response_model=List[BranchResponse])
async def list_branches(db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminBranchController(db).list_all()

@router.get("/{id}", response_model=BranchResponse)
async def get_branch(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminBranchController(db).get_by_id(id)

@router.post("", response_model=BranchResponse, status_code=status.HTTP_201_CREATED)
async def create_branch(data: BranchCreate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminBranchController(db).create(data)

@router.put("/{id}", response_model=BranchResponse)
async def update_branch(id: str, data: BranchUpdate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return await AdminBranchController(db).update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_branch(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    await AdminBranchController(db).delete(id)
