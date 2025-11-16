const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();

// Send Json
app.use(bodyParser.json());

// Accsses Port (.env)
const port = process.env.PORT || 5050;

// Connect DataBase
connectDB();

// routers uses
app.use("/api/users" , userRoutes);
app.use("/api" , productRoutes);

// listen port
app.listen(port, () => {
  console.log("Listen Succsses");
});
