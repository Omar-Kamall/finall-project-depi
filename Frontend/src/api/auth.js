import axios from "axios";
const BASE_URL = "https://jinstore-production.up.railway.app/api/users";


// Create axios instance
const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


authApi.interceptors.request.use((config) => {
  // Get Token With Local Storage
  const token = localStorage.getItem("token");
  if(token)
    config.headers.Authorization = `Bearer ${token}`;

  return config;
})




// Register a new user
export const register = async ({ name, email, password, city , phone , address , role }) => {
  try {
    // Register user using FakeStore API /users endpoint
    const res = await authApi.post("/register", {
      name,
      email,
      password,
      city,
      phone,
      address,
      role,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};



// Login user
export const login = async ({ email, password }) => {
  try {
    const res = await authApi.post("/login", {
      email,
      password,
    });

    // Get Token
    const token = res.token;
    localStorage.setItem("token", token);

    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};



// Simplae Logout Remove Token With LocalStorage
export const logout = () => {
  localStorage.removeItem("token");
};



export const updateProfile = async (updatedData) => {
  try {
    const res = await authApi.put(`/updateProfile/${updatedData.email}`, updatedData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
