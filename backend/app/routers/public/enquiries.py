from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.controllers.public import PublicController
from app.schemas.public import EnquiryCreate

router = APIRouter(prefix="/enquiries", tags=["Public - Enquiries"])

@router.post("")
async def submit_enquiry(enquiry: EnquiryCreate, db: AsyncSession = Depends(get_db)):
    controller = PublicController(db)
    return await controller.submit_enquiry(enquiry)
