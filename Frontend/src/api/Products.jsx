const BASE_URL = "https://fakestoreapi.com/products";

// Internal helper with basic error handling
const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const message = `Request failed (${res.status} ${res.statusText}) for ${url}`;
    throw new Error(message);
  }
  return res.json();
};

// Fetch all products
export const getAllProducts = async () => fetchJson(BASE_URL);

// Fetch single product by ID
export const getProductById = async (id) => fetchJson(`${BASE_URL}/${id}`);

// Fetch products by category
export const getProductsByCategory = async (category) =>
  fetchJson(`${BASE_URL}/category/${encodeURIComponent(category)}`);

// Limit the number of products (pass any number you want)
export const getLimitedProducts = async (limit = 5) => {
  const safeLimit = Number(limit);
  const finalLimit = Number.isFinite(safeLimit) && safeLimit > 0 ? safeLimit : 5;
  return fetchJson(`${BASE_URL}?limit=${finalLimit}`);
};

// Sort products by rating (client-side)
export const getProductsSortedByRating = async (order = "desc", limit = 5) => {
  const products = await getAllProducts();
  const sorted = [...products].sort((a, b) =>
    order === "asc"
      ? a.rating.rate - b.rating.rate
      : b.rating.rate - a.rating.rate
  );
  return sorted.slice(0, limit);
};

// list categories (useful for filters/menus)
export const getCategories = async () => fetchJson(`${BASE_URL}/categories`);
