const mongoose = require("mongoose");                    // Import mongoose
const schema = mongoose.Schema;                          // Shortcut for Schema

const productModel = new schema(
  {
    title: { type: String, required: true },             // Product title
    price: { type: Number, required: true },             // Current price
    oldPrice: { type: Number, required: true },          // Previous price (for discounts)
    description: { type: String },                       // Product description
    category: { type: String, required: true },          // Product category
    image: { type: String, required: true },             // Image URL
    imagePublicId: { type: String, required: true },     // Cloudinary image ID
    count: { type: Number, required: true },             // Stock quantity
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin/Seller who added it
  },
  { versionKey: false }                                   // Disable __v
);

module.exports = mongoose.model("products", productModel); // Export Product model
