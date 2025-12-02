import { createContext, useContext, useEffect, useState } from "react";
import {
  getCartItems,
  // addCart,
  // clearCart,
  // removeProductFromCart,
  // updateCartQuantity,
} from "../api/cart";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCartItems();
        setCartItems(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const addToCart = async (product) => {
    if (user.role === "user") {
      const findProduct = cartItems.find(
        (item) => item.productId === product.productId
      );
      if (findProduct) {
        const newQuantity =
          Number(findProduct.quantity || 0) + Number(product.quantity || 1);
        setCartItems(
          cartItems.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );

        // await updateCartQuantity({...product , quantity: newQuantity});
      } else {
        setCartItems([...cartItems, product]);
        // await addCart(product);
      }
    }
  };

  const totalPrice = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const removeFromCart = async (productId) => {
    if (user.role === "user") {
      const findProduct = cartItems.find(
        (item) => item.productId === productId
      );
      if (!findProduct) return "Product Not Found";

      setCartItems(cartItems.filter((item) => item.productId !== productId));

      // await removeProductFromCart(productId);
    }
  };

  const updateQuantity = async (product) => {
    if (user.role === "user") {
      const findProduct = cartItems.find(
        (item) => item.productId === product.productId
      );
      if (!findProduct) return "Product Not Found";

      setCartItems(
        cartItems.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: product.quantity }
            : item
        )
      );
      // await updateCartQuantity(product);
    }
  };

  const clearCartItems = async () => {
    if (user.role === "user") {
      setCartItems([]);
      // await clearCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCartItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
