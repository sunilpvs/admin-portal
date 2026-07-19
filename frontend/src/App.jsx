import { useEffect, useState } from "react";
import { fetchHomeData } from "./api/client";
import CartDrawer from "./components/CartDrawer";
import CategoryGrid from "./components/CategoryGrid";
import DropSection from "./components/DropSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Newsletter from "./components/Newsletter";
import Philosophy from "./components/Philosophy";
import TrendingSection from "./components/TrendingSection";
import { CartProvider } from "./context/CartContext";

const FALLBACK_ANNOUNCEMENTS = [
  { id: 1, text: "DROP 004 — MONSOON EDIT IS LIVE" },
  { id: 2, text: "FREE DELIVERY ABOVE ₹599" },
  { id: 3, text: "EASY 7-DAY RETURNS" },
  { id: 4, text: "COD AVAILABLE" },
  { id: 5, text: "INDIA-SPECIFIC SIZING" },
  { id: 6, text: "USE CODE STITCH10 FOR 10% OFF" },
];

export default function App() {
  const [data, setData] = useState({
    announcements: FALLBACK_ANNOUNCEMENTS,
    categories: [],
    dropProducts: [],
    trendingProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchHomeData()
      .then((payload) => {
        if (!active) return;
        setData(payload);
        setError("");
      })
      .catch(() => {
        if (!active) return;
        setError("Could not reach the STITCH API. Showing the storefront shell.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <CartProvider>
      <div className="app-shell" id="top">
        <Header />
        <Marquee items={data.announcements} />
        <main>
          <Hero />
          {error ? <div className="error-banner">{error}</div> : null}
          {loading ? <div className="loading-screen">LOADING DROP 004…</div> : null}
          <CategoryGrid categories={data.categories} />
          <DropSection products={data.dropProducts} />
          <TrendingSection products={data.trendingProducts} />
          <Philosophy />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
