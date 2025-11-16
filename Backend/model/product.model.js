const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productModel = new schema(
  {
    title: { type: String, require: true },
    price: { type: Number, require: true },
    oldPrice: { type: Number, require: true },
    description: { type: String, require: true },
    category: { type: String, require: true },
    image: { type: String, require: true },
    count: { type: Number, require: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("products", productModel);
