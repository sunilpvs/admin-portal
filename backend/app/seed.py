from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Announcement, Category, Product

IMG = "https://images.unsplash.com/photo-"

CATEGORIES = [
    {
        "slug": "women",
        "label": "WOMEN",
        "style_count": 124,
        "image_url": f"{IMG}1535487958887-032fb5767ade?w=700&h=900&fit=crop&auto=format",
        "sort_order": 1,
    },
    {
        "slug": "men",
        "label": "MEN",
        "style_count": 98,
        "image_url": f"{IMG}1614028574724-baea020fbe9e?w=700&h=900&fit=crop&auto=format",
        "sort_order": 2,
    },
    {
        "slug": "unisex",
        "label": "UNISEX",
        "style_count": 56,
        "image_url": f"{IMG}1654878673361-b832b25c290e?w=700&h=900&fit=crop&auto=format",
        "sort_order": 3,
    },
]

PRODUCTS = [
    {
        "name": "Shadow Cargo Pant",
        "slug": "shadow-cargo-pant",
        "price": 1299,
        "original_price": 1799,
        "tag": "BESTSELLER",
        "sizes": "S,M,L,XL",
        "image_url": f"{IMG}1661772808076-d8afec568b66?w=600&h=750&fit=crop&auto=format",
        "color": "#2C2C2C",
        "is_drop": True,
        "is_trending": False,
        "category_slug": "unisex",
        "description": "Relaxed cargo silhouette with utility pockets. India-fit rise and length.",
    },
    {
        "name": "Void Oversized Tee",
        "slug": "void-oversized-tee",
        "price": 799,
        "original_price": None,
        "tag": "NEW",
        "sizes": "XS,S,M,L,XL,XXL",
        "image_url": f"{IMG}1532332248682-206cc786359f?w=600&h=750&fit=crop&auto=format",
        "color": "#1A1A1A",
        "is_drop": True,
        "is_trending": False,
        "category_slug": "unisex",
        "description": "Heavyweight cotton oversized tee with dropped shoulders.",
    },
    {
        "name": "Monochrome Co-ord",
        "slug": "monochrome-co-ord",
        "price": 1599,
        "original_price": 1999,
        "tag": "LIMITED",
        "sizes": "S,M,L",
        "image_url": f"{IMG}1723042610117-175d2a947480?w=600&h=750&fit=crop&auto=format",
        "color": "#3A3A3A",
        "is_drop": True,
        "is_trending": False,
        "category_slug": "women",
        "description": "Matched co-ord set in soft monochrome tones for monsoon layering.",
    },
    {
        "name": "Raw Edge Hoodie",
        "slug": "raw-edge-hoodie",
        "price": 1099,
        "original_price": None,
        "tag": "NEW",
        "sizes": "S,M,L,XL",
        "image_url": f"{IMG}1654878673361-b832b25c290e?w=600&h=750&fit=crop&auto=format",
        "color": "#222222",
        "is_drop": True,
        "is_trending": False,
        "category_slug": "men",
        "description": "Brushed fleece hoodie with raw-cut hem and kangaroo pocket.",
    },
    {
        "name": "Drop Shoulder Jacket",
        "slug": "drop-shoulder-jacket",
        "price": 2199,
        "original_price": None,
        "tag": "TRENDING",
        "sizes": "S,M,L,XL",
        "image_url": f"{IMG}1614028574724-baea020fbe9e?w=500&h=640&fit=crop&auto=format",
        "color": "#1A1A1A",
        "is_drop": False,
        "is_trending": True,
        "category_slug": "men",
        "description": "Structured drop-shoulder jacket for transitional weather.",
    },
    {
        "name": "Washed Denim Set",
        "slug": "washed-denim-set",
        "price": 1899,
        "original_price": None,
        "tag": None,
        "sizes": "S,M,L,XL",
        "image_url": f"{IMG}1580478491436-fd6a937acc9e?w=500&h=640&fit=crop&auto=format",
        "color": "#2A2A2A",
        "is_drop": False,
        "is_trending": True,
        "category_slug": "women",
        "description": "Soft washed denim jacket and pant set with relaxed ease.",
    },
    {
        "name": "Matte Track Pant",
        "slug": "matte-track-pant",
        "price": 999,
        "original_price": 1299,
        "tag": "SALE",
        "sizes": "S,M,L,XL",
        "image_url": f"{IMG}1532074198010-97d0c3700b7a?w=500&h=640&fit=crop&auto=format",
        "color": "#222222",
        "is_drop": False,
        "is_trending": True,
        "category_slug": "unisex",
        "description": "Matte finish track pant with tapered ankle and drawcord.",
    },
    {
        "name": "Utility Vest",
        "slug": "utility-vest",
        "price": 1199,
        "original_price": None,
        "tag": None,
        "sizes": "S,M,L,XL",
        "image_url": f"{IMG}1535487958887-032fb5767ade?w=500&h=640&fit=crop&auto=format",
        "color": "#2C2C2C",
        "is_drop": False,
        "is_trending": True,
        "category_slug": "women",
        "description": "Multi-pocket utility vest that layers over tees and hoodies.",
    },
    {
        "name": "Relaxed Linen Shirt",
        "slug": "relaxed-linen-shirt",
        "price": 949,
        "original_price": None,
        "tag": "NEW",
        "sizes": "S,M,L,XL",
        "image_url": f"{IMG}1661772807980-1a4f9e3d6e2f?w=500&h=640&fit=crop&auto=format",
        "color": "#3A3A3A",
        "is_drop": False,
        "is_trending": True,
        "category_slug": "men",
        "description": "Breathable relaxed linen shirt cut for humid Indian summers.",
    },
]

ANNOUNCEMENTS = [
    "DROP 004 — MONSOON EDIT IS LIVE",
    "FREE DELIVERY ABOVE ₹599",
    "EASY 7-DAY RETURNS",
    "COD AVAILABLE",
    "INDIA-SPECIFIC SIZING",
    "USE CODE STITCH10 FOR 10% OFF",
]


def seed_database(db: Session) -> None:
    if db.scalar(select(Category.id).limit(1)):
        return

    categories_by_slug: dict[str, Category] = {}
    for item in CATEGORIES:
        category = Category(**item)
        db.add(category)
        categories_by_slug[item["slug"]] = category

    db.flush()

    for item in PRODUCTS:
        payload = dict(item)
        category_slug = payload.pop("category_slug")
        product = Product(**payload, category_id=categories_by_slug[category_slug].id)
        db.add(product)

    for index, text in enumerate(ANNOUNCEMENTS):
        db.add(Announcement(text=text, sort_order=index))

    db.commit()
