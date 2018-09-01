const mongoose = require("mongoose");

const characterSchema = mongoose.Schema({
  name: String,
  realm: String
});

const teamSchema = mongoose.Schema({
  name: { type: String, unique: true, index: true },
  characters: [characterSchema]
});

module.exports = mongoose.model("Team", teamSchema);
