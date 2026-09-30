from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.admin_auth import AdminLogin, AdminLoginResponse, AdminUserBase
from app.services.admin_auth import AdminAuthService, AuthenticationError, InactiveUserError
from app.models import AdminUser

class AdminAuthController:
    def __init__(self, db: AsyncSession):
        self.service = AdminAuthService(db)

    async def login(self, data: AdminLogin) -> AdminLoginResponse:
        try:
            result = await self.service.authenticate_admin(data.email, data.password)
            return AdminLoginResponse(
                access_token=result["access_token"],
                token_type=result["token_type"],
                admin=AdminUserBase(
                    id=str(result["admin"].id),
                    email=result["admin"].email,
                    name=result["admin"].name,
                    is_active=result["admin"].is_active
                )
            )
        except AuthenticationError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except InactiveUserError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin user is inactive",
            )

    async def get_me(self, current_admin: AdminUser) -> AdminUserBase:
        return AdminUserBase(
            id=str(current_admin.id),
            email=current_admin.email,
            name=current_admin.name,
            is_active=current_admin.is_active
        )
