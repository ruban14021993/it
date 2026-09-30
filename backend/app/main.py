from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = os.path.abspath(settings.UPLOAD_DIR)
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

from app.routers.public import home, products, services, industries, about, training, contact, navigation, faqs, enquiries
from app.routers.admin import auth, category, product, service, industry, training as admin_training, homepage, about as admin_about, contact as admin_contact, branch, enquiry, media

PUBLIC_PREFIX = "/api/v1/public"
ADMIN_PREFIX = "/api/v1/admin"

# Public routes
app.include_router(home.router, prefix=PUBLIC_PREFIX)
app.include_router(products.router, prefix=PUBLIC_PREFIX)
app.include_router(services.router, prefix=PUBLIC_PREFIX)
app.include_router(industries.router, prefix=PUBLIC_PREFIX)
app.include_router(about.router, prefix=PUBLIC_PREFIX)
app.include_router(training.router, prefix=PUBLIC_PREFIX)
app.include_router(contact.router, prefix=PUBLIC_PREFIX)
app.include_router(navigation.router, prefix=PUBLIC_PREFIX)
app.include_router(faqs.router, prefix=PUBLIC_PREFIX)
app.include_router(enquiries.router, prefix=PUBLIC_PREFIX)

# Admin routes
app.include_router(auth.router, prefix=ADMIN_PREFIX)
app.include_router(category.router, prefix=ADMIN_PREFIX)
app.include_router(product.router, prefix=ADMIN_PREFIX)
app.include_router(service.router, prefix=ADMIN_PREFIX)
app.include_router(industry.router, prefix=ADMIN_PREFIX)
app.include_router(admin_training.router, prefix=ADMIN_PREFIX)
app.include_router(homepage.router, prefix=ADMIN_PREFIX)
app.include_router(admin_about.router, prefix=ADMIN_PREFIX)
app.include_router(admin_contact.router, prefix=ADMIN_PREFIX)
app.include_router(branch.router, prefix=ADMIN_PREFIX)
app.include_router(enquiry.router, prefix=ADMIN_PREFIX)
app.include_router(media.router, prefix=ADMIN_PREFIX)

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": settings.APP_VERSION}
