from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Announcement, Category, Product
from app.schemas import AnnouncementOut, CategoryOut, ProductOut
from app.serializers import serialize_product

router = APIRouter(tags=["catalog"])


@router.get("/announcements", response_model=list[AnnouncementOut])
def list_announcements(db: Session = Depends(get_db)) -> list[Announcement]:
    return list(db.scalars(select(Announcement).order_by(Announcement.sort_order.asc())).all())


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.sort_order.asc())).all())


@router.get("/categories/{slug}", response_model=CategoryOut)
def get_category(slug: str, db: Session = Depends(get_db)) -> Category:
    category = db.scalar(select(Category).where(Category.slug == slug))
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/products", response_model=list[ProductOut])
def list_products(
    drop: bool | None = Query(default=None),
    trending: bool | None = Query(default=None),
    category: str | None = Query(default=None),
    tag: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[ProductOut]:
    stmt = select(Product)

    if drop is not None:
        stmt = stmt.where(Product.is_drop.is_(drop))
    if trending is not None:
        stmt = stmt.where(Product.is_trending.is_(trending))
    if tag:
        stmt = stmt.where(Product.tag == tag.upper())
    if category:
        category_row = db.scalar(select(Category).where(Category.slug == category.lower()))
        if not category_row:
            return []
        stmt = stmt.where(Product.category_id == category_row.id)

    products = db.scalars(stmt.order_by(Product.id.asc())).all()
    return [serialize_product(product) for product in products]


@router.get("/products/drop", response_model=list[ProductOut])
def list_drop_products(db: Session = Depends(get_db)) -> list[ProductOut]:
    products = db.scalars(select(Product).where(Product.is_drop.is_(True)).order_by(Product.id.asc())).all()
    return [serialize_product(product) for product in products]


@router.get("/products/trending", response_model=list[ProductOut])
def list_trending_products(db: Session = Depends(get_db)) -> list[ProductOut]:
    products = db.scalars(
        select(Product).where(Product.is_trending.is_(True)).order_by(Product.id.asc())
    ).all()
    return [serialize_product(product) for product in products]


@router.get("/products/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)) -> ProductOut:
    product = db.scalar(select(Product).where(Product.slug == slug))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_product(product)
