import "./CategoryGrid.css";

export default function CategoryGrid({ categories = [] }) {
  return (
    <section className="section" id="categories">
      <div className="section-head">
        <h2 className="section-title">Shop by category</h2>
        <a className="section-link" href="#drop">
          VIEW ALL →
        </a>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <a
            key={category.id}
            className="category-card"
            href={`#${category.slug}`}
            id={category.slug}
          >
            <img src={category.image_url} alt={category.label} />
            <div className="category-meta">
              <small>{category.style_count} styles</small>
              <strong>{category.label}</strong>
              <span className="category-cta">
                SHOP NOW <span>→</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
