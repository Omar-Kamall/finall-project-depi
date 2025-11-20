import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateCartQuantity as updateCartQuantityApi,
  clearCart as clearCartApi,
  getLocalCart,
} from "../api/cart";
import { getProductById } from "../api/Products";

const CartContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items with product details
  const loadCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const localCart = getLocalCart();
      
      if (localCart && localCart.products && localCart.products.length > 0) {
        // Fetch product details for each cart item
        const itemsWithDetails = await Promise.all(
          localCart.products.map(async (item) => {
            try {
              const product = await getProductById(item.productId);
              return {
                ...product,
                quantity: item.quantity,
                cartProductId: item.productId,
              };
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
              return null;
            }
          })
        );

        // Filter out null values
        setCartItems(itemsWithDetails.filter((item) => item !== null));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const addToCart = async (product, quantity = 1) => {
    try {
      await addToCartApi({ id: product.id, quantity }, 1);
      await loadCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromCartApi(productId, 1);
      await loadCartItems();
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCartQuantityApi(productId, quantity, 1);
      await loadCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi(1);
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    refreshCart: loadCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

