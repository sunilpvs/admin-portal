import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export async function fetchHomeData() {
  const [announcements, categories, dropProducts, trendingProducts] = await Promise.all([
    api.get("/announcements"),
    api.get("/categories"),
    api.get("/products/drop"),
    api.get("/products/trending"),
  ]);

  return {
    announcements: announcements.data,
    categories: categories.data,
    dropProducts: dropProducts.data,
    trendingProducts: trendingProducts.data,
  };
}

export async function subscribeNewsletter(email) {
  const { data } = await api.post("/newsletter/subscribe", { email });
  return data;
}

export async function createCheckout(items, email) {
  const { data } = await api.post("/checkout", { items, email });
  return data;
}
