const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { connectDB } = require("./config/db");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const contactRoutes = require("./routes/contact.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");

dotenv.config();
const app = express();

// Configure CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Frontend Link
//     credentials: true, // Send Tokens with Frontend
//   })
// );
app.use(cors());

// Send Json
app.use(express.json());

// Accsses Port (.env)
const port = process.env.PORT || 5050;

// Connect DataBase
connectDB();

// routers uses
app.use("/api/users", userRoutes);
app.use("/api", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

// listen port
// app.listen(port, () => {
//   console.log("Listen Succsses");
// });

module.exports = app;