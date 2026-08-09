import { useRef } from "react";
import ProductCard from "./ProductCard";
import "./TrendingSection.css";

export default function TrendingSection({ products = [] }) {
  const railRef = useRef(null);

  const scrollBy = (direction) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  return (
    <section className="section" id="trending" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="trending-head">
        <h2 className="section-title">Trending now</h2>
        <div className="trending-controls">
          <button className="trend-btn" type="button" onClick={() => scrollBy(-1)} aria-label="Previous">
            ←
          </button>
          <button className="trend-btn" type="button" onClick={() => scrollBy(1)} aria-label="Next">
            →
          </button>
        </div>
      </div>

      <div className="trending-rail" ref={railRef}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}
