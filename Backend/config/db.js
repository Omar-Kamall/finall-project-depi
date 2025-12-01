const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const DB_URL = process.env.DB_URL;

exports.connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Succsses DB");
  } catch (error) {
    console.log(error.message);
  }
};
