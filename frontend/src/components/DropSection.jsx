import ProductCard from "./ProductCard";
import "./DropSection.css";

export default function DropSection({ products = [] }) {
  return (
    <section className="section" id="drop" style={{ borderTop: "1px solid #1a1a1a" }}>
      <div className="drop-intro">
        <div>
          <p className="eyebrow">JUST DROPPED</p>
          <h2 className="drop-title">
            Drop 004
            <br />
            <em>Monsoon Edit</em>
          </h2>
        </div>
        <div className="drop-aside">
          <p>Launched July 19, 2026</p>
          <a className="section-link" href="#trending">
            VIEW FULL DROP →
          </a>
        </div>
      </div>

      <div className="drop-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="drop-mobile-link">
        <a className="section-link" href="#trending">
          VIEW FULL DROP →
        </a>
      </div>
    </section>
  );
}
