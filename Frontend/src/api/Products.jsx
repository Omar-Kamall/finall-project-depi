import axios from "axios";

const BASE_URL = "https://fakestoreapi.com/products";

// Create axios instance for products
const productsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await productsApi.get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

// Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const response = await productsApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch product"
    );
  }
};

// Fetch products by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await productsApi.get(
      `/category/${encodeURIComponent(category)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products by category"
    );
  }
};

// Limit the number of products (pass any number you want)
export const getLimitedProducts = async (limit = 5) => {
  try {
    const safeLimit = Number(limit);
    const finalLimit =
      Number.isFinite(safeLimit) && safeLimit > 0 ? safeLimit : 5;
    const response = await productsApi.get(`/?limit=${finalLimit}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch limited products"
    );
  }
};

// Sort products by rating (client-side)
export const getProductsSortedByRating = async (order = "desc", limit = 5) => {
  try {
    const products = await getAllProducts();
    const sorted = [...products].sort((a, b) =>
      order === "asc"
        ? a.rating.rate - b.rating.rate
        : b.rating.rate - a.rating.rate
    );
    return sorted.slice(0, limit);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch sorted products"
    );
  }
};

// list categories (useful for filters/menus)
export const getCategories = async () => {
  try {
    const response = await productsApi.get("/categories");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};
