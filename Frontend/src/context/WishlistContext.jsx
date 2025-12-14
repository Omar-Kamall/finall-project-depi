import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = "wishlistItems";

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    const findProduct = wishlistItems.find(
      (item) => item.productId === product.productId
    );
    if (!findProduct) {
      setWishlistItems([...wishlistItems, product]);
      return true; // Added successfully
    }
    return false; // Already in wishlist
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(
      wishlistItems.filter((item) => item.productId !== productId)
    );
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.productId)) {
      removeFromWishlist(product.productId);
      return false; // Removed
    } else {
      addToWishlist(product);
      return true; // Added
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        setWishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);

