import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product
from app.schemas import CheckoutIn, CheckoutOut, CartItemOut
from app.serializers import serialize_product

router = APIRouter(prefix="/checkout", tags=["checkout"])


@router.post("/preview", response_model=list[CartItemOut])
def preview_cart(payload: CheckoutIn, db: Session = Depends(get_db)) -> list[CartItemOut]:
    items: list[CartItemOut] = []
    for item in payload.items:
        product = db.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        sizes = [size.strip() for size in product.sizes.split(",") if size.strip()]
        if item.size not in sizes:
            raise HTTPException(status_code=400, detail=f"Size {item.size} unavailable for {product.name}")
        serialized = serialize_product(product)
        items.append(
            CartItemOut(
                product=serialized,
                size=item.size,
                quantity=item.quantity,
                line_total=serialized.price * item.quantity,
            )
        )
    return items


@router.post("", response_model=CheckoutOut)
def create_checkout(payload: CheckoutIn, db: Session = Depends(get_db)) -> CheckoutOut:
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    preview = preview_cart(payload, db)
    subtotal = sum(item.line_total for item in preview)
    order_id = f"STITCH-{uuid.uuid4().hex[:8].upper()}"
    return CheckoutOut(
        order_id=order_id,
        item_count=sum(item.quantity for item in preview),
        subtotal=subtotal,
        message="Order received. Pay on delivery or via UPI at checkout.",
    )
