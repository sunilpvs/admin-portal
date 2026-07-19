export function formatINR(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export function tagStyle(tag) {
  const map = {
    BESTSELLER: { background: "#C8F135", color: "#080808" },
    NEW: { background: "#EDEAE4", color: "#080808" },
    LIMITED: { background: "#FF6B35", color: "#080808" },
    SALE: { background: "#FF6B35", color: "#080808" },
    TRENDING: { background: "#C8F135", color: "#080808" },
  };
  return map[tag] || { background: "#EDEAE4", color: "#080808" };
}
