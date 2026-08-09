import "./Marquee.css";

export default function Marquee({ items = [] }) {
  const loop = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((item, index) => (
          <span key={`${item.id || item.text}-${index}`} className="marquee-item">
            {item.text || item}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
