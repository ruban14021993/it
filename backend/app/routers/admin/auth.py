from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import AdminUser
from app.schemas.admin_auth import AdminLogin, AdminLoginResponse, AdminUserBase
from app.core.deps import get_current_admin
from app.controllers.admin_auth import AdminAuthController

router = APIRouter(prefix="/auth", tags=["Admin - Auth"])

@router.post("/login", response_model=AdminLoginResponse)
async def login(data: AdminLogin, db: AsyncSession = Depends(get_db)):
    controller = AdminAuthController(db)
    return await controller.login(data)

@router.get("/me", response_model=AdminUserBase)
async def me(current_user: AdminUser = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    controller = AdminAuthController(db)
    return await controller.get_me(current_user)
