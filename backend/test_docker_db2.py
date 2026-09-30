import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

async def main():
    engine = create_async_engine("postgresql+asyncpg://infinity_user:infinity_pass@127.0.0.1:5444/infinitydb", echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    try:
        async with async_session() as session:
            result = await session.execute(text("SELECT count(*) FROM products"))
            print(f"Products in Docker DB: {result.scalar()}")
    except Exception as e:
        print(f"Error: {e}")
    await engine.dispose()

asyncio.run(main())
