from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import NewsletterSubscriber
from app.schemas import NewsletterCreate, NewsletterOut

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("/subscribe", response_model=NewsletterOut)
def subscribe(payload: NewsletterCreate, db: Session = Depends(get_db)) -> NewsletterOut:
    email = payload.email.lower().strip()
    existing = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already subscribed")

    db.add(NewsletterSubscriber(email=email))
    db.commit()
    return NewsletterOut(message="You're on the list. Check your inbox.", email=email)
