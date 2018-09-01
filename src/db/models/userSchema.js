const mongoose = require("mongoose");

// _id here is the discord id of the user
const userSchema = mongoose.Schema({
  _id: String,
  discordTag: String,
  characterIds: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("User", userSchema);
