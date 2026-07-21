import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./Header.css";

const LINKS = ["NEW", "WOMEN", "MEN", "UNISEX", "SALE"];

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l-1 11H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="site-header">
      {searchOpen && (
        <div className="search-overlay">
          <input autoFocus placeholder="Search for tees, cargos, co-ords..." />
          <button className="search-esc" onClick={() => setSearchOpen(false)} type="button">
            ESC
          </button>
        </div>
      )}

      <nav className="site-nav">
        <a className="brand" href="#top">
          STITCH
        </a>

        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className={link === "SALE" ? "is-sale" : undefined}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search" type="button" onClick={() => setSearchOpen(true)}>
            <IconSearch />
          </button>
          <button className="icon-btn desktop-only" aria-label="Wishlist" type="button">
            <IconHeart />
          </button>
          <button className="icon-btn cart-btn" aria-label="Bag" type="button" onClick={openCart}>
            <IconBag />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          <button
            className="icon-btn mobile-toggle"
            aria-label="Menu"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {LINKS.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
            {link}
          </a>
        ))}
      </div>
    </header>
  );
}
