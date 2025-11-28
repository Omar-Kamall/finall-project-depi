const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userModel = new schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    city: { type: String },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["admin", "saller", "user"], require: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("users", userModel);
