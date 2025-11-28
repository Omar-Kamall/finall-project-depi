const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderModel = new schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: {
      street: { type: String },
      apartment: { type: String },
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        title: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("order", orderModel);
