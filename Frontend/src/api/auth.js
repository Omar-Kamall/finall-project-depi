import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

// Create axios instance
const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Register a new user using FakeStore API
 * @param {Object} userData - { username, email, password, role }
 * @returns {Promise<Object>} User object with token
 */
export const register = async (userData) => {
  try {
    // Register user using FakeStore API /users endpoint
    const response = await authApi.post("/users", {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      name: {
        firstname: userData.username.split(" ")[0] || userData.username,
        lastname: userData.username.split(" ").slice(1).join(" ") || "",
      },
      address: {
        city: "",
        street: "",
        number: 0,
        zipcode: "",
        geolocation: {
          lat: "",
          long: "",
        },
      },
      phone: "",
    });

    // Generate a token for the new user
    // FakeStore API's /auth/login might not work immediately after registration
    // So we generate our own token and store the user
    const token = `fake_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Add role to the user (always vendor as requested)
    const newUser = {
      ...response.data,
      role: "vendor", // Always assign vendor role as requested
      token: token,
    };

    // Store in localStorage for persistence
    localStorage.setItem("fakeStoreAuth", JSON.stringify(newUser));

    return { data: newUser };
  } catch (error) {
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Registration failed. Please try again.");
    }
    throw new Error(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
};

/**
 * Login user using FakeStore API
 * @param {Object} credentials - { username (can be username or email), password }
 * @returns {Promise<Object>} User object with token
 */
export const login = async (credentials) => {
  try {
    // First, get all users from FakeStore API
    const usersResponse = await authApi.get("/users");
    const isEmail = credentials.username.includes("@");
    
    // Find user by username or email
    const user = usersResponse.data.find(
      (u) =>
        u.username === credentials.username || 
        (isEmail && u.email === credentials.username)
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Verify password matches
    if (user.password !== credentials.password) {
      throw new Error("Invalid username or password");
    }

    // Try to get token from FakeStore API login
    // If it fails, we'll generate our own token
    let token;
    try {
      const loginResponse = await authApi.post("/auth/login", {
        username: user.username,
        password: credentials.password,
      });
      token = loginResponse.data.token;
    } catch {
      // If FakeStore API login fails, generate our own token
      // This handles cases where newly registered users can't login via FakeStore API
      token = `fake_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    // Add role and token to user data
    const userData = {
      ...user,
      role: "vendor", // Always assign vendor role as requested
      token: token,
    };

    // Store in localStorage for persistence
    localStorage.setItem("fakeStoreAuth", JSON.stringify(userData));

    return { data: userData };
  } catch (error) {
    // Handle 401 or other auth errors
    if (error.response?.status === 401 || error.response?.status === 400) {
      throw new Error("Invalid username or password");
    }
    throw new Error(
      error.response?.data?.message || error.message || "Invalid username or password"
    );
  }
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  try {
    const authData = localStorage.getItem("fakeStoreAuth");
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    // Return null if there's an error parsing, don't throw
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("fakeStoreAuth");
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
export const updateProfile = async (userData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Update in localStorage
    const updatedUser = {
      ...currentUser,
      ...userData,
    };

    // Update in users array
    const users = JSON.parse(localStorage.getItem("fakeStoreUsers") || "[]");
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("fakeStoreUsers", JSON.stringify(users));
    }

    localStorage.setItem("fakeStoreAuth", JSON.stringify(updatedUser));

    return { data: updatedUser };
  } catch (error) {
    throw new Error(error.message || "Failed to update profile");
  }
};

