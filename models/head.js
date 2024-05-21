const mongoose = require("mongoose");
const headSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Head", headSchema);
