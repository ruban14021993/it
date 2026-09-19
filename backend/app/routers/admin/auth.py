from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime, timezone
from app.database import get_db
from app.models import AdminUser
from app.schemas import LoginRequest, TokenResponse, AdminUserOut
from app.core.security import verify_password, create_access_token
from app.core.deps import get_current_admin

router = APIRouter(prefix="/auth", tags=["Admin - Auth"])


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdminUser).where(AdminUser.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not user.is_active or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    await db.execute(
        update(AdminUser).where(AdminUser.id == user.id).values(last_login_at=datetime.now(timezone.utc))
    )
    await db.commit()
    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AdminUserOut)
async def me(current_user: AdminUser = Depends(get_current_admin)):
    return AdminUserOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        is_active=current_user.is_active,
        role=current_user.role.name if current_user.role else "",
    )
