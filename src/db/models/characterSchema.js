const mongoose = require("mongoose");

const characterSchema = mongoose.Schema({
  name: String,
  realm: String
});

module.exports = characterSchema;
