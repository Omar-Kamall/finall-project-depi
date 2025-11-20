import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

// Create axios instance for cart
const cartApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Get all carts (for a user)
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of cart items
 */
export const getCart = async (userId = 1) => {
  try {
    // Use localStorage first to avoid loading all carts from API
    const localCart = getLocalCart();
    if (localCart) {
      return [localCart];
    }
    // If no local cart, try API
    const response = await cartApi.get(`/carts/user/${userId}`);
    return response.data || [];
  } catch {
    // If API fails, return empty array
    return [];
  }
};

/**
 * Add product to cart
 * @param {Object} product - Product object with id, quantity
 * @param {number} userId - User ID (default: 1)
 * @returns {Promise<Object>} Cart object
 */
export const addToCart = async (product, userId = 1) => {
  try {
    // Use localStorage directly for better performance and reliability
    const storedCart = JSON.parse(localStorage.getItem("fakeStoreCart") || "{}");
    const products = storedCart.products || [];
    
    const existingProduct = products.find((p) => p.productId === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity || 1;
    } else {
      products.push({
        productId: product.id,
        quantity: product.quantity || 1,
      });
    }

    const cartData = {
      id: storedCart.id || Date.now(),
      userId: userId,
      products: products,
      date: storedCart.date || new Date().toISOString(),
    };
    localStorage.setItem("fakeStoreCart", JSON.stringify(cartData));

    // Try to sync with API in background (don't wait for it)
    try {
      const carts = await getCart(userId);
      let currentCart = carts.length > 0 ? carts[0] : null;

      if (!currentCart) {
        await cartApi.post("/carts", {
          userId: userId,
          date: cartData.date,
          products: cartData.products,
        });
      } else {
        await cartApi.put(`/carts/${currentCart.id}`, {
          userId: currentCart.userId,
          date: currentCart.date,
          products: cartData.products,
        });
      }
    } catch {
      // Silently fail - localStorage is the source of truth
      console.log("API sync failed, using localStorage only");
    }

    return cartData;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

/**
 * Remove product from cart
 * @param {number} productId - Product ID to remove
 * @param {number} userId - User ID (default: 1)
 * @returns {Promise<Object>} Updated cart object
 */
export const removeFromCart = async (productId, userId = 1) => {
  try {
    // Use localStorage directly
    const storedCart = JSON.parse(localStorage.getItem("fakeStoreCart") || "{}");
    const products = (storedCart.products || []).filter(
      (p) => p.productId !== productId
    );

    const cartData = {
      id: storedCart.id || Date.now(),
      userId: userId,
      products: products,
      date: storedCart.date || new Date().toISOString(),
    };
    localStorage.setItem("fakeStoreCart", JSON.stringify(cartData));

    // Try to sync with API in background
    try {
      const carts = await getCart(userId);
      const currentCart = carts.length > 0 ? carts[0] : null;
      if (currentCart) {
        await cartApi.put(`/carts/${currentCart.id}`, {
          userId: currentCart.userId,
          date: currentCart.date,
          products: cartData.products,
        });
      }
    } catch {
      // Silently fail
    }

    return cartData;
  } catch (err) {
    console.error("Error removing from cart:", err);
    throw err;
  }
};

/**
 * Update product quantity in cart
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 * @param {number} userId - User ID (default: 1)
 * @returns {Promise<Object>} Updated cart object
 */
export const updateCartQuantity = async (productId, quantity, userId = 1) => {
  try {
    if (quantity <= 0) {
      return await removeFromCart(productId, userId);
    }

    // Use localStorage directly
    const storedCart = JSON.parse(localStorage.getItem("fakeStoreCart") || "{}");
    const products = storedCart.products || [];
    const product = products.find((p) => p.productId === productId);
    
    if (product) {
      product.quantity = quantity;
    } else {
      // Product not found, add it
      products.push({
        productId: productId,
        quantity: quantity,
      });
    }

    const cartData = {
      id: storedCart.id || Date.now(),
      userId: userId,
      products: products,
      date: storedCart.date || new Date().toISOString(),
    };
    localStorage.setItem("fakeStoreCart", JSON.stringify(cartData));

    // Try to sync with API in background
    try {
      const carts = await getCart(userId);
      const currentCart = carts.length > 0 ? carts[0] : null;
      if (currentCart) {
        await cartApi.put(`/carts/${currentCart.id}`, {
          userId: currentCart.userId,
          date: currentCart.date,
          products: cartData.products,
        });
      }
    } catch {
      // Silently fail
    }

    return cartData;
  } catch (err) {
    console.error("Error updating cart quantity:", err);
    throw err;
  }
};

/**
 * Clear cart
 * @param {number} userId - User ID (default: 1)
 * @returns {Promise<void>}
 */
export const clearCart = async (userId = 1) => {
  try {
    const carts = await getCart(userId);
    if (carts.length > 0) {
      await cartApi.delete(`/carts/${carts[0].id}`);
    }
  } catch {
    // Ignore errors
  }
  localStorage.removeItem("fakeStoreCart");
};

/**
 * Get cart from localStorage
 * @returns {Object|null} Cart object or null
 */
export const getLocalCart = () => {
  try {
    const cartData = localStorage.getItem("fakeStoreCart");
    return cartData ? JSON.parse(cartData) : null;
  } catch {
    return null;
  }
};

