const mongoose = require('mongoose');
const schema = mongoose.Schema;

const cartModel = new schema({
    productId: { type: mongoose.Schema.Types.ObjectId , ref: "products" , required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" , required: true  }
}, { versionKey: false });

module.exports = mongoose.model("cart" , cartModel)