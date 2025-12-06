// Cart
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const cartModel = new schema({
    productId: { type: mongoose.Schema.Types.ObjectId , ref: "products" , required: true },
    quantity: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" , required: true  }
}, { versionKey: false });

cartModel.index({ createdBy: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("cart" , cartModel)
