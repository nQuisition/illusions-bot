const mongoose = require("mongoose");

const characterClaimSchema = mongoose.Schema({
  userId: { type: String, ref: "User" },
  claimedCharacterId: mongoose.Schema.Types.ObjectId,
  added: Date
});

characterClaimSchema.index(
  { userId: 1, claimedCharacterId: 1 },
  { unique: true }
);

module.exports = mongoose.model("CharacterClaim", characterClaimSchema);
