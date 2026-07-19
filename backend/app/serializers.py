from app.models import Product
from app.schemas import ProductOut


def serialize_product(product: Product) -> ProductOut:
    sizes = [size.strip() for size in (product.sizes or "").split(",") if size.strip()]
    discount = None
    if product.original_price and product.original_price > product.price:
        discount = int(round((1 - product.price / product.original_price) * 100))

    return ProductOut(
        id=product.id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=product.price,
        original_price=product.original_price,
        tag=product.tag,
        image_url=product.image_url,
        color=product.color,
        sizes=sizes,
        is_drop=product.is_drop,
        is_trending=product.is_trending,
        category_id=product.category_id,
        discount_percent=discount,
    )
