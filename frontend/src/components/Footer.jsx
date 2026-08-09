import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#top">
            STITCH
          </a>
          <p>Trendy, affordable fashion built for India. New drops. Honest fits. Real sizing.</p>
          <div className="socials">
            <a href="#footer">IG</a>
            <a href="#footer">YT</a>
            <a href="#footer">WA</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>SHOP</h4>
          <a href="#new">New Arrivals</a>
          <a href="#women">Women</a>
          <a href="#men">Men</a>
          <a href="#unisex">Unisex</a>
          <a href="#sale">Sale</a>
        </div>

        <div className="footer-col">
          <h4>HELP</h4>
          <a href="#footer">Size Guide</a>
          <a href="#footer">Track Order</a>
          <a href="#footer">Returns & Exchange</a>
          <a href="#footer">FAQ</a>
          <a href="#footer">Contact Us</a>
        </div>

        <div className="footer-col">
          <h4>COMPANY</h4>
          <a href="#footer">About STITCH</a>
          <a href="#footer">Careers</a>
          <a href="#footer">Instagram</a>
          <a href="#footer">Privacy Policy</a>
          <a href="#footer">Terms of Service</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 STITCH. All rights reserved. Made in India 🇮🇳</span>
        <div className="pay-methods">
          <span>UPI</span>
          <span>CARDS</span>
          <span>COD</span>
          <span>EMI</span>
        </div>
      </div>
    </footer>
  );
}
