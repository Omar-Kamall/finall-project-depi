const dotenv = require("dotenv");         // Load environment variable handler
const mongoose = require("mongoose");     // Import mongoose for DB connection

dotenv.config();                          // Initialize dotenv to access .env values
const DB_URL = process.env.DB_URL;        // Read database URL from environment variables

exports.connectDB = async () => {         // Export function to connect to MongoDB
  try {
    await mongoose.connect(DB_URL);       // Connect to MongoDB using the URL
    console.log("Succsses DB");           // Log success message
  } catch (error) {
    console.log(error.message);           // Log any connection errors
  }
};
