import axios from "axios";

const Api = "http://localhost:5050/api";

const orderApi = axios.create({
  baseURL: Api,
  headers: {
    "Content-Type": "application/json",
  },
});

orderApi.interceptors.request.use((config) => {
  // Get Token And Check
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const postOrder = async (order) => {
  try {
    const res = await orderApi.post("/order", order);
    return res;
  } catch (error) {
    throw new Error(error.response.message);
  }
};

export const getOrders = async () => {
  try {
    const res = await orderApi.get("/order");
    return res;
  } catch (error) {
    throw new Error(error.response.message);
  }
};
