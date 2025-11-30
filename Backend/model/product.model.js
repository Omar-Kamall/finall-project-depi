const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productModel = new schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    count: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("products", productModel);
