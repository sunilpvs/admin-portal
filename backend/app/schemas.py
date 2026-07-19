from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    label: str
    style_count: int
    image_url: str
    sort_order: int


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str | None = None
    price: float
    original_price: float | None = None
    tag: str | None = None
    image_url: str
    color: str | None = None
    sizes: list[str]
    is_drop: bool
    is_trending: bool
    category_id: int | None = None
    discount_percent: int | None = None


class AnnouncementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    sort_order: int


class NewsletterCreate(BaseModel):
    email: EmailStr


class NewsletterOut(BaseModel):
    message: str
    email: EmailStr


class CartItemIn(BaseModel):
    product_id: int
    size: str = Field(min_length=1, max_length=8)
    quantity: int = Field(default=1, ge=1, le=10)


class CartItemOut(BaseModel):
    product: ProductOut
    size: str
    quantity: int
    line_total: float


class CheckoutIn(BaseModel):
    items: list[CartItemIn]
    email: EmailStr | None = None


class CheckoutOut(BaseModel):
    order_id: str
    item_count: int
    subtotal: float
    message: str


class HealthOut(BaseModel):
    status: str
    time: datetime
