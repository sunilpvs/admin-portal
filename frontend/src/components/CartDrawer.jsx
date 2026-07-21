import { useState } from "react";
import { createCheckout } from "../api/client";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/format";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, removeItem, clearCart } = useCart();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onCheckout = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const payload = items.map((item) => ({
        product_id: item.product.id,
        size: item.size,
        quantity: item.quantity,
      }));
      const result = await createCheckout(payload);
      setMessage(`${result.message} Order ${result.order_id}`);
      clearCart();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`cart-backdrop ${isOpen ? "open" : ""}`} onClick={closeCart} />
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <div className="cart-head">
          <span>YOUR BAG ({count})</span>
          <button type="button" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-body">
          {count === 0 ? (
            <div className="cart-empty">
              <p>Your bag is empty.</p>
              <button className="btn btn-primary" type="button" onClick={closeCart}>
                SHOP NOW
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={`${item.product.id}-${item.size}`}>
                <img src={item.product.image_url} alt={item.product.name} />
                <div>
                  <h4>{item.product.name}</h4>
                  <p>
                    Size {item.size} · Qty {item.quantity}
                  </p>
                  <p>{formatINR(item.product.price * item.quantity)}</p>
                </div>
                <button type="button" onClick={() => removeItem(item.product.id, item.size)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {count > 0 && (
          <div className="cart-foot">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>{formatINR(subtotal)}</strong>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} type="button" onClick={onCheckout} disabled={loading}>
              {loading ? "PROCESSING..." : `CHECKOUT — ${formatINR(subtotal)}`}
            </button>
            {message ? <p className="cart-message">{message}</p> : null}
            {error ? <p className="cart-error">{error}</p> : null}
          </div>
        )}
      </aside>
    </>
  );
}
