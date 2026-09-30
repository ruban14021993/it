from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.admin_user import AdminUserRepository
from app.core.security import verify_password, create_access_token

class AuthenticationError(Exception):
    pass

class InactiveUserError(Exception):
    pass

class AdminAuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminUserRepository(db)

    async def authenticate_admin(self, email: str, password: str) -> dict:
        admin = await self.repo.get_by_email(email)
        if not admin:
            raise AuthenticationError("Incorrect email or password")
        
        if not verify_password(password, admin.hashed_password):
            raise AuthenticationError("Incorrect email or password")
            
        if not admin.is_active:
            raise InactiveUserError("Admin user is inactive")
            
        await self.repo.update_last_login(admin)
        
        access_token = create_access_token(data={"sub": str(admin.id)})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "admin": admin
        }
