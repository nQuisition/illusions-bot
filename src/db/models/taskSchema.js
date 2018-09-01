const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  userId: { type: String, ref: "User" },
  added: Date,
  name: String,
  value: String,
  type: { type: String, index: true },
  startTime: { type: Date, index: true },
  repeatable: Boolean,
  interval: Number,
  completed: { type: Boolean, default: false, index: true }
});

module.exports = mongoose.model("Task", taskSchema);
