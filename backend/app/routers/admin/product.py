from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.models import AdminUser
from app.core.deps import get_current_admin
from app.controllers.admin_product import AdminProductController
from app.schemas import ProductCreate, ProductUpdate
from app.schemas.admin_crud import ProductResponse

router = APIRouter(prefix="/products", tags=['Admin - Products'])

@router.get("", response_model=List[ProductResponse])
async def list_records(db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = AdminProductController(db)
    return await controller.list_all()

@router.get("/{id}", response_model=ProductResponse)
async def get_record(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = AdminProductController(db)
    return await controller.get_by_id(id)

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_record(data: ProductCreate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = AdminProductController(db)
    return await controller.create(data)

@router.put("/{id}", response_model=ProductResponse)
async def update_record(id: str, data: ProductUpdate, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = AdminProductController(db)
    return await controller.update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = AdminProductController(db)
    await controller.delete(id)
