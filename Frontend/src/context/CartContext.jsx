import { createContext, useContext, useState } from "react";
import // getCartItems,
// addCart,
// clearCart,
// removeProductFromCart,
// updateCartQuantity,
"../api/cart";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser();

  const addToCart = async (product) => {
    if (user.role === "user") {
      const findProduct = cartItems.find(
        (item) => item.productId === product.productId
      );
      if (findProduct) {
        const newQuantity =
          Number(findProduct.quantity || 0) + Number(product.quantity || 1);

        if (newQuantity > Number(findProduct.count)) {
          return false;
        }
        setCartItems(
          cartItems.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        return true;

        // await updateCartQuantity({...product , quantity: newQuantity});
      } else {
        setCartItems([...cartItems, product]);
        return true;
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
      if (!findProduct) return false;

      if (product.quantity <= product.count) {
        setCartItems(
          cartItems.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: product.quantity }
              : item
          )
        );
        // await updateCartQuantity(product);
        return true;
      }
      return false;
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
