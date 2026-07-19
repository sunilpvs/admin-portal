import "./Philosophy.css";

const FEATURES = [
  {
    icon: "⚡",
    title: "New drops weekly",
    text: "50+ fresh styles added every week",
  },
  {
    icon: "📦",
    title: "Free delivery ₹599+",
    text: "Delivered in 2–4 days pan-India",
  },
  {
    icon: "↩",
    title: "7-day easy returns",
    text: "Free pickup, instant store credit",
  },
  {
    icon: "📐",
    title: "India-fit sizing",
    text: "Every piece sized for Indian bodies",
  },
];

export default function Philosophy() {
  return (
    <>
      <section className="philosophy" id="sale">
        <div className="philosophy-watermark" aria-hidden="true">
          <span>STITCH</span>
        </div>
        <div className="philosophy-content">
          <p className="eyebrow">OUR PHILOSOPHY</p>
          <h2 className="philosophy-title">
            Fashion that moves
            <br />
            <em>at your speed.</em>
          </h2>
          <p className="philosophy-text">
            STITCH is built for the India that&apos;s always online, always discovering. New drops every week,
            India-first sizing, and a 7-day return promise — because trying it on should feel risk-free.
          </p>
          <div className="philosophy-actions">
            <a className="btn btn-light" href="#drop">
              SHOP NEW ARRIVALS
            </a>
            <a className="btn btn-secondary" href="#footer">
              OUR STORY
            </a>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-item">
              <span className="icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
