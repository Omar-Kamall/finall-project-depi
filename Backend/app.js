const express = require("express");      // Import Express framework
const dotenv = require("dotenv");        // Import dotenv to load environment variables
const cors = require("cors");            // Import CORS to allow external requests

const { connectDB } = require("./config/db");     // Import database connection function
const userRoutes = require("./routes/user.routes");     // User routes
const productRoutes = require("./routes/product.routes"); // Product routes
const contactRoutes = require("./routes/contact.routes"); // Contact routes
const orderRoutes = require("./routes/order.routes");     // Order routes
const cartRoutes = require("./routes/cart.routes");       // Cart routes

dotenv.config();                        // Load .env file values into process.env
const app = express();                  // Initialize Express app

app.use(cors());                        // Enable CORS to allow frontend to access backend
app.use(express.json());                // Allow backend to receive JSON data from requests

const port = process.env.PORT || 5050;  // Get port from .env or use default 5050

connectDB();                            // Connect to MongoDB database

// routers uses
app.use("/api/users", userRoutes);       // User routes (login, register, profile...)
app.use("/api", productRoutes);          // Product routes (add, get, update, delete)
app.use("/api/contact", contactRoutes);  // Contact routes (send + get messages)
app.use("/api/order", orderRoutes);      // Order routes (create & fetch orders)
app.use("/api/cart", cartRoutes);        // Cart routes (add, update, delete cart items)

// listen port
app.listen(port, () => {                  // Start the server on the selected port
  console.log("Listen Succsses");         // Log that the server is running
});

// module.exports = app;                  // (Optional) Export app for testing or external use
