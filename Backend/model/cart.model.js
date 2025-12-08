// Cart
const mongoose = require('mongoose');                     // Import mongoose to work with MongoDB
const schema = mongoose.Schema;                           // Create shorthand for Schema

const cartModel = new schema({                            // Define the Cart schema
    productId: { type: mongoose.Schema.Types.ObjectId , ref: "products" , required: true },   // Product reference
    quantity: { type: Number, required: true },            // Quantity of this product in the cart
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" , required: true  }        // The user who owns the cart item
}, { versionKey: false });                                 // Disable __v field

cartModel.index({ createdBy: 1, productId: 1 }, { unique: true });   // Prevent duplicate items for the same user

module.exports = mongoose.model("cart" , cartModel);       // Export Cart model for use in controllers
