const characterHandlers = require("./characterHandlers");

const CLAIM_CHARACTERS_COMMAND = "claim";
const CLAIM_CHARACTER_DESCRIPTION = "";

const ASSIGN_CHARACTERS_COMMAND = "assign";
const ASSIGN_CHARACTERS_DESCRIPTION = "";

const SHOW_CLAIMS_COMMAND = "claims";
const SHOW_CLAIMS_DESCRIPTION = "";

const SHOW_ILVL_LEADERBOARD_COMMAND = "ilvl";
const SHOW_ILVL_LEADERBOARD_DESCRIPTION = "";

const INSPECT_CHARACTER_COMMAND = "inspect";
const INSPECT_CHARACTER_DESCRIPTION = "";

const commands = {
  [CLAIM_CHARACTERS_COMMAND]: {
    handler: characterHandlers.claimHandler,
    description: CLAIM_CHARACTER_DESCRIPTION
  },
  [ASSIGN_CHARACTERS_COMMAND]: {
    handler: characterHandlers.assignHandler,
    description: ASSIGN_CHARACTERS_DESCRIPTION
  },
  [SHOW_CLAIMS_COMMAND]: {
    handler: characterHandlers.showClaimsHandler,
    description: SHOW_CLAIMS_DESCRIPTION
  },
  [SHOW_ILVL_LEADERBOARD_COMMAND]: {
    handler: characterHandlers.showIlvlLeaderboardHandler,
    description: SHOW_ILVL_LEADERBOARD_DESCRIPTION
  },
  [INSPECT_CHARACTER_COMMAND]: {
    handler: characterHandlers.inspectCharacter,
    description: INSPECT_CHARACTER_DESCRIPTION
  }
};

module.exports = commands;
