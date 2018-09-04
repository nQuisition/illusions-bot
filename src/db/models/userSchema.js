const mongoose = require("mongoose");
const characterSchema = require("./characterSchema");

// _id here is the discord id of the user
const userSchema = mongoose.Schema({
  _id: String,
  discordTag: String,
  characters: [characterSchema],
  rank: Number
});

module.exports = mongoose.model("User", userSchema);
