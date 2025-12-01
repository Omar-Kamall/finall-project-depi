import axios from "axios";

const Api = "https://jinstore-lac.vercel.app/api/cart";

// Create axios instance for cart
const cartApi = axios.create({
  baseURL: Api,
  headers: {
    "Content-Type": "application/json",
  },
});


cartApi.interceptors.request.use(config => {
  // Get Token With LocalStorage
  const token = localStorage.getItem("token");
  if(token)
    config.headers.Authorization = `Bearer ${token}`;

  return config;
})


// Get all carts (for a user)
export const getCartItems = async () => {
  try {
    const res = await cartApi.get("/getCartItems");
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

// Add product to cart
export const addCart = async (product) => {
  try {
    const res = await cartApi.post("/addProductToCart", product);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

// Remove product from cart
export const removeProductFromCart = async (productId) => {
  try {
    const res = await cartApi.delete(`/removeProductFromCart/${productId}`);
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};

// Update product quantity in cart
export const updateCartQuantity = async (product) => {
  try {
    const res = await cartApi.put(`/updateProductQuantity/${product.productId}` , product );
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const res = await cartApi.delete(`/clearProductsFromCart`);
    return res.data;
  } catch (err){
    throw new Error(err);
  }
};
