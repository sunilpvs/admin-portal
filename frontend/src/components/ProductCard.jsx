import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatINR, tagStyle } from "../utils/format";
import "./ProductCard.css";

export default function ProductCard({ product, compact = false }) {
  const { addItem } = useCart();
  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, selectedSize);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="product-card" style={compact ? { width: "240px", scrollSnapAlign: "start" } : undefined}>
      <div className="product-media" style={{ background: product.color || "#1a1a1a" }}>
        <img src={product.image_url} alt={product.name} loading="lazy" />
        {product.tag && (
          <span className="product-tag" style={tagStyle(product.tag)}>
            {product.tag}
          </span>
        )}
        <button className="wishlist-dot" type="button" aria-label="Wishlist">
          ♥
        </button>
        {!compact && (
          <div className="quick-add">
            <p className="quick-label">SELECT SIZE</p>
            <div className="size-row">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-chip ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <button type="button" className={`add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
              {added ? "ADDED" : "ADD TO BAG"}
            </button>
          </div>
        )}
      </div>

      <h3 className="product-name">{product.name}</h3>
      <div className="product-price">
        <strong>{formatINR(product.price)}</strong>
        {product.original_price ? <s>{formatINR(product.original_price)}</s> : null}
        {product.discount_percent ? <span className="off">{product.discount_percent}% OFF</span> : null}
      </div>
    </article>
  );
}
