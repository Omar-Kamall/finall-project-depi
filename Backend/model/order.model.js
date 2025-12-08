const mongoose = require("mongoose");                          // Import mongoose
const schema = mongoose.Schema;                                // Shortcut for Schema

const orderModel = new schema(                                 // Define Order schema
  {
    fname: { type: String, required: true },                   // Customer first name
    lname: { type: String, required: true },                   // Customer last name
    country: { type: String, required: true },                 // Country for shipping
    city: { type: String, required: true },                    // City for shipping
    address: {                                                 // Detailed address
      street: { type: String },                                // Street name
      apartment: { type: String },                             // Apartment or unit number
    },
    email: { type: String, required: true },                   // Customer email
    phone: { type: String, required: true },                   // Customer phone number
    notes: { type: String },                                   // Optional notes for the order
    products: [                                                // List of purchased products
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true }, // Product reference
        title: { type: String, required: true },               // Product title snapshot
        image: { type: String, required: true },               // Product image snapshot
        quantity: { type: Number, required: true },            // Purchased quantity
        price: { type: Number, required: true },               // Snapshot price at purchase time
      },
    ],
    totalPrice: { type: Number, required: true },              // Final order total
    createdBy: {                                               // User who placed the order
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }                                        // Disable __v
);

module.exports = mongoose.model("order", orderModel);           // Export Order model
