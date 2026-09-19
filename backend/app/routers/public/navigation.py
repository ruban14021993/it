from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import NavigationItem, SocialLink, SiteSetting
from app.schemas import NavigationItemOut, SocialLinkOut
from pydantic import BaseModel

router = APIRouter(tags=["Public - Navigation"])


class FooterResponse(BaseModel):
    nav_groups: dict[str, list[NavigationItemOut]]
    social_links: list[SocialLinkOut]
    description: str | None
    copyright_text: str | None


@router.get("/navigation", response_model=list[NavigationItemOut])
async def get_navigation(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(NavigationItem)
        .where(
            NavigationItem.is_active == True,
            NavigationItem.location == "primary",
            NavigationItem.parent_id.is_(None),
        )
        .options(selectinload(NavigationItem.children))
        .order_by(NavigationItem.display_order)
    )
    return result.scalars().all()


@router.get("/footer", response_model=FooterResponse)
async def get_footer(db: AsyncSession = Depends(get_db)):
    footer_locations = [
        "footer_products", "footer_industries", "footer_services", "footer_more"
    ]
    nav_groups: dict[str, list[NavigationItemOut]] = {}
    for loc in footer_locations:
        result = await db.execute(
            select(NavigationItem)
            .where(NavigationItem.is_active == True, NavigationItem.location == loc)
            .order_by(NavigationItem.display_order)
        )
        items = result.scalars().all()
        nav_groups[loc] = [NavigationItemOut.model_validate(i) for i in items]

    social_result = await db.execute(
        select(SocialLink).where(SocialLink.is_active == True).order_by(SocialLink.display_order)
    )
    social_links = social_result.scalars().all()

    desc_result = await db.execute(
        select(SiteSetting).where(SiteSetting.key == "footer_description")
    )
    desc_setting = desc_result.scalar_one_or_none()

    copy_result = await db.execute(
        select(SiteSetting).where(SiteSetting.key == "copyright_text")
    )
    copy_setting = copy_result.scalar_one_or_none()

    return FooterResponse(
        nav_groups=nav_groups,
        social_links=[SocialLinkOut.model_validate(s) for s in social_links],
        description=desc_setting.value if desc_setting else None,
        copyright_text=copy_setting.value if copy_setting else None,
    )
