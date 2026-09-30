import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import uuid
import bcrypt
from app.config import settings
from datetime import datetime, timezone

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

async def main():
    engine = create_async_engine("postgresql+asyncpg://infinity_user:infinity_pass@127.0.0.1:5444/infinitydb", echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    try:
        async with async_session() as session:
            # Check if superadmin role exists
            result = await session.execute(text("SELECT id FROM roles WHERE name = 'superadmin'"))
            role_id = result.scalar()
            
            if not role_id:
                role_id = str(uuid.uuid4())
                await session.execute(text("INSERT INTO roles (id, name, permissions, created_at) VALUES (:id, 'superadmin', '{\"all\": true}', CURRENT_TIMESTAMP)"), {"id": role_id})
                print("Created superadmin role.")
            
            # Check if admin exists
            result = await session.execute(text("SELECT id FROM admin_users WHERE email = :email"), {"email": settings.ADMIN_EMAIL})
            admin_id = result.scalar()
            
            if not admin_id:
                admin_id = str(uuid.uuid4())
                hashed_pw = hash_password(settings.ADMIN_PASSWORD)
                await session.execute(text("""
                    INSERT INTO admin_users (id, email, name, hashed_password, is_active, role_id, created_at, updated_at)
                    VALUES (:id, :email, :name, :pw, true, :role_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """), {
                    "id": admin_id,
                    "email": settings.ADMIN_EMAIL,
                    "name": settings.ADMIN_NAME,
                    "pw": hashed_pw,
                    "role_id": role_id
                })
                print(f"Created admin user with email {settings.ADMIN_EMAIL}")
            else:
                # Update password just in case
                hashed_pw = hash_password(settings.ADMIN_PASSWORD)
                await session.execute(text("UPDATE admin_users SET hashed_password = :pw WHERE id = :id"), {"pw": hashed_pw, "id": admin_id})
                print(f"Updated password for existing admin user {settings.ADMIN_EMAIL}")
            
            await session.commit()
            print("Successfully seeded admin credentials in Docker DB.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await engine.dispose()

asyncio.run(main())
