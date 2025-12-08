const mongoose = require("mongoose");
const schema = mongoose.Schema;

const contactModel = new schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("contact", contactModel);
