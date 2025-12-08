const mongoose = require("mongoose");                           // Import mongoose
const schema = mongoose.Schema;                                 // Shortcut for Schema

const userModel = new schema(
  {
    name: { type: String, require: true },                      // User's name
    email: { type: String, require: true, unique: true },       // User's email (must be unique)
    password: { type: String, require: true },                  // User's hashed password
    city: { type: String },                                     // Optional city field
    phone: { type: String },                                    // Optional phone number
    address: { type: String },                                  // Optional address
    role: { type: String, enum: ["admin", "saller", "user"], require: true },  // User role
  },
  {
    versionKey: false,                                          // Disable __v field
  }
);

module.exports = mongoose.model("users", userModel);             // Export User model
