import "./Hero.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=900&h=1200&fit=crop&auto=format";

export default function Hero() {
  return (
    <section className="hero" id="new">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker fade-up">DROP 004 — MONSOON EDIT 2026</p>
          <h1 className="hero-title fade-up fade-up-delay-1">
            Wear the
            <br />
            <em>season</em>
            <br />
            before it
            <br />
            hits the feed.
          </h1>
          <p className="hero-text fade-up fade-up-delay-2">
            Curated streetwear drops built for India — oversized fits, India sizing, and delivery in 3 days.
          </p>
          <div className="hero-actions fade-up fade-up-delay-3">
            <a className="btn btn-primary" href="#drop">
              SHOP THE DROP
            </a>
            <a className="btn btn-secondary" href="#categories">
              EXPLORE ALL
            </a>
          </div>
          <div className="hero-stats fade-up fade-up-delay-3">
            <div className="hero-stat">
              <strong>50+</strong>
              <span>NEW STYLES / WEEK</span>
            </div>
            <div className="hero-stat">
              <strong>3-day</strong>
              <span>PAN-INDIA DELIVERY</span>
            </div>
            <div className="hero-stat">
              <strong>7-day</strong>
              <span>FREE RETURNS</span>
            </div>
          </div>
        </div>

        <div className="hero-media">
          <img src={HERO_IMAGE} alt="STITCH Monsoon Edit — editorial fashion" />
          <div className="hero-fade" />
          <div className="hero-badge">
            <span>DROP 004</span>
          </div>
        </div>
      </div>
    </section>
  );
}
