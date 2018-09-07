const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  author: { type: String, ref: "User", index: true },
  channel: String,
  message: String,
  postedAt: Date,
  succeeded: { type: Boolean, default: true, index: true },
  output: String,
  marked: Boolean
});

module.exports = mongoose.model("Message", messageSchema);
