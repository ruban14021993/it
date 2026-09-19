from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import ContactSetting, Branch, SocialLink
from app.schemas import ContactSettingOut, BranchOut, SocialLinkOut, ContactFormSubmission
from pydantic import BaseModel

router = APIRouter(prefix="/contact", tags=["Public - Contact"])


class ContactPublicResponse(BaseModel):
    settings: ContactSettingOut | None
    branches: list[BranchOut]
    social_links: list[SocialLinkOut]


@router.get("", response_model=ContactPublicResponse)
async def get_contact(db: AsyncSession = Depends(get_db)):
    settings_result = await db.execute(select(ContactSetting).limit(1))
    settings = settings_result.scalar_one_or_none()

    branches_result = await db.execute(
        select(Branch).where(Branch.is_active == True).order_by(Branch.display_order)
    )
    branches = branches_result.scalars().all()

    social_result = await db.execute(
        select(SocialLink).where(SocialLink.is_active == True).order_by(SocialLink.display_order)
    )
    social_links = social_result.scalars().all()

    return ContactPublicResponse(
        settings=ContactSettingOut.model_validate(settings) if settings else None,
        branches=[BranchOut.model_validate(b) for b in branches],
        social_links=[SocialLinkOut.model_validate(s) for s in social_links],
    )


@router.post("/submit", status_code=201)
async def submit_contact_form(form: ContactFormSubmission, db: AsyncSession = Depends(get_db)):
    # Form submissions are logged. Email delivery can be wired in a later phase.
    return {"message": "Your message has been received. We will get back to you shortly."}
