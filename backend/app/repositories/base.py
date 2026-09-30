from typing import Generic, TypeVar, Type, Optional, Sequence, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, model_cls: Type[T], session: AsyncSession):
        self.model_cls = model_cls
        self.session = session

    async def get_by_id(self, id: Any) -> Optional[T]:
        return await self.session.get(self.model_cls, id)

    async def get_by_slug(self, slug: str) -> Optional[T]:
        if not hasattr(self.model_cls, 'slug'):
            return None
        stmt = select(self.model_cls).where(getattr(self.model_cls, 'slug') == slug)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list(self) -> Sequence[T]:
        stmt = select(self.model_cls)
        # Assuming display_order exists for most content entities
        if hasattr(self.model_cls, 'display_order'):
            stmt = stmt.order_by(getattr(self.model_cls, 'display_order'))
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def list_published(self) -> Sequence[T]:
        stmt = select(self.model_cls)
        if hasattr(self.model_cls, 'is_active'):
            stmt = stmt.where(getattr(self.model_cls, 'is_active') == True)
        if hasattr(self.model_cls, 'display_order'):
            stmt = stmt.order_by(getattr(self.model_cls, 'display_order'))
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def count(self) -> int:
        stmt = select(func.count()).select_from(self.model_cls)
        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def create(self, obj: T) -> T:
        self.session.add(obj)
        return obj
        
    async def delete(self, obj: T) -> None:
        await self.session.delete(obj)
