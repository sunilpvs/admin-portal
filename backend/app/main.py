from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.routers import catalog, checkout, newsletter
from app.schemas import HealthOut
from app.seed import seed_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


settings = get_settings()

app = FastAPI(
    title="STITCH API",
    description="Middleware API for the STITCH monsoon edit storefront",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog.router, prefix="/api")
app.include_router(newsletter.router, prefix="/api")
app.include_router(checkout.router, prefix="/api")


@app.get("/api/health", response_model=HealthOut)
def health() -> HealthOut:
    return HealthOut(status="ok", time=datetime.now(timezone.utc))
