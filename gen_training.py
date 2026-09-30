import os

REPOS_DIR = "backend/app/repositories"
SERVICES_DIR = "backend/app/services"
CONTROLLERS_DIR = "backend/app/controllers"
ROUTERS_DIR = "backend/app/routers/admin"

ENTITIES = [
    {
        "name": "training",
        "model": "TrainingProgram",
        "schema_create": "TrainingCreate",
        "schema_update": "TrainingUpdate",
        "schema_out": "TrainingDetailOut",
        "router_prefix": "/training",
        "tags": ["Admin - Training"],
        "has_category_check": False
    }
]

REPO_TEMPLATE = """
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence
from app.models import {model}

class Admin{Model}Repository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_all(self) -> Sequence[{model}]:
        stmt = select({model})
        if hasattr({model}, 'display_order'):
            stmt = stmt.order_by({model}.display_order)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, id: str) -> {model} | None:
        return await self.db.get({model}, id)

    async def get_by_slug(self, slug: str) -> {model} | None:
        stmt = select({model}).where({model}.slug == slug)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, obj: {model}) -> {model}:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: {model}) -> {model}:
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete(self, obj: {model}) -> None:
        await self.db.delete(obj)
        await self.db.commit()
"""

SERVICE_TEMPLATE = """
import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.repositories.admin_{name} import Admin{Model}Repository
from app.models import {model}
from app.schemas import {schema_create}, {schema_update}

class DuplicateSlugError(Exception):
    pass

class NotFoundError(Exception):
    pass

class DependencyError(Exception):
    pass

def normalize_slug(slug: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', slug.lower()).strip('-')

class Admin{Model}Service:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = Admin{Model}Repository(db)

    async def list_all(self):
        return await self.repo.list_all()

    async def get_by_id(self, id: str):
        obj = await self.repo.get_by_id(id)
        if not obj:
            raise NotFoundError()
        return obj

    async def create(self, data: {schema_create}):
        if getattr(data, 'slug', None):
            data.slug = normalize_slug(data.slug)
            existing = await self.repo.get_by_slug(data.slug)
            if existing:
                raise DuplicateSlugError(f"Slug '{{data.slug}}' already exists.")

        obj_data = data.model_dump(exclude_unset=True)
        obj = {model}(**obj_data)
        
        try:
            return await self.repo.create(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateSlugError("Database integrity error. Slug may be a duplicate.")

    async def update(self, id: str, data: {schema_update}):
        obj = await self.get_by_id(id)
        
        if getattr(data, 'slug', None):
            data.slug = normalize_slug(data.slug)
            existing = await self.repo.get_by_slug(data.slug)
            if existing and existing.id != obj.id:
                raise DuplicateSlugError(f"Slug '{{data.slug}}' is already used by another record.")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
            
        try:
            return await self.repo.update(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateSlugError("Database integrity error during update.")

    async def delete(self, id: str):
        obj = await self.get_by_id(id)
        try:
            await self.repo.delete(obj)
        except IntegrityError:
            await self.db.rollback()
            raise DependencyError("Cannot delete this record because other records depend on it.")
"""

CONTROLLER_TEMPLATE = """
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.admin_{name} import Admin{Model}Service, NotFoundError, DuplicateSlugError, DependencyError
from app.schemas import {schema_create}, {schema_update}

class Admin{Model}Controller:
    def __init__(self, db: AsyncSession):
        self.service = Admin{Model}Service(db)

    async def list_all(self):
        return await self.service.list_all()

    async def get_by_id(self, id: str):
        try:
            return await self.service.get_by_id(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    async def create(self, data: {schema_create}):
        try:
            return await self.service.create(data)
        except DuplicateSlugError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def update(self, id: str, data: {schema_update}):
        try:
            return await self.service.update(id, data)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
        except DuplicateSlugError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def delete(self, id: str):
        try:
            await self.service.delete(id)
        except NotFoundError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
        except DependencyError as e:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
"""

ROUTER_TEMPLATE = """
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.models import AdminUser
from app.core.deps import get_current_admin
from app.controllers.admin_{name} import Admin{Model}Controller
from app.schemas import {schema_create}, {schema_update}, {schema_out}

router = APIRouter(prefix="{router_prefix}", tags={tags})

@router.get("", response_model=List[{schema_out}])
async def list_records(db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = Admin{Model}Controller(db)
    return await controller.list_all()

@router.get("/{id}", response_model={schema_out})
async def get_record(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = Admin{Model}Controller(db)
    return await controller.get_by_id(id)

@router.post("", response_model={schema_out}, status_code=status.HTTP_201_CREATED)
async def create_record(data: {schema_create}, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = Admin{Model}Controller(db)
    return await controller.create(data)

@router.put("/{id}", response_model={schema_out})
async def update_record(id: str, data: {schema_update}, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = Admin{Model}Controller(db)
    return await controller.update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(id: str, db: AsyncSession = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    controller = Admin{Model}Controller(db)
    await controller.delete(id)
"""

for ent in ENTITIES:
    name = ent["name"]
    Model = ent["model"]
    
    # Repo
    repo_code = REPO_TEMPLATE.format(model=Model, Model=Model)
    with open(f"{REPOS_DIR}/admin_{name}.py", "w") as f:
        f.write(repo_code.strip() + "\n")
        
    # Service
    svc_code = SERVICE_TEMPLATE.format(**ent, Model=Model)
    with open(f"{SERVICES_DIR}/admin_{name}.py", "w") as f:
        f.write(svc_code.strip() + "\n")
        
    # Controller
    ctrl_code = CONTROLLER_TEMPLATE.format(**ent, Model=Model)
    with open(f"{CONTROLLERS_DIR}/admin_{name}.py", "w") as f:
        f.write(ctrl_code.strip() + "\n")
        
    # Router
    router_code = ROUTER_TEMPLATE.format(**ent, Model=Model, id="{id}")
    with open(f"{ROUTERS_DIR}/{name}.py", "w") as f:
        f.write(router_code.strip() + "\n")

print("Training files updated.")
