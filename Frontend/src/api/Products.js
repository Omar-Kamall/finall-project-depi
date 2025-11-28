import axios from "axios";

const Api = "http://localhost:5050/api";

// Create axios instance for products
const productsApi = axios.create({
  baseURL: Api,
  headers: {
    "Content-Type": "application/json",
  },
});

// Send Token With Requests
productsApi.interceptors.request.use((config) => {
  // Get Token With LocalStoreage
  const token = localStorage.getItem("token");
  if(token)
    config.headers.Authorization = `Bearer ${token}`;

  return config;
})


// Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await productsApi.get("/products");
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const response = await productsApi.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.message || "Failed to fetch product"
    );
  }
};

// Fetch products by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await productsApi.get(
      `products/category/${category}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.message || "Failed to fetch products by category"
    );
  }
};

// list categories (useful for filters/menus)
export const getCategories = async () => {
  try {
    const response = await productsApi.get("/products/categories");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.message || "Failed to fetch categories"
    );
  }
};
