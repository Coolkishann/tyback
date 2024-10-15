const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  blogHead: {
    type: String,
    required: true,
  },
  blogData: {
    type: String,
    required: true,
  },
  file: {
    default:null,
    type: String, // Store the filename or path
  },
});

module.exports = mongoose.model("Blog", blogSchema);