const mongoose = require("mongoose");                 // Import mongoose
const schema = mongoose.Schema;                       // Shortcut for Schema

const contactModel = new schema(                      // Define Contact schema
  {
    name: { type: String, required: true },           // Sender name
    email: { type: String, required: true },          // Sender email
    message: { type: String, required: true },        // Message content
  },
  { versionKey: false }                               // Disable __v field
);

module.exports = mongoose.model("contact", contactModel); // Export Contact model
