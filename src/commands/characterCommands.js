const characterHandlers = require("./handlers/characterHandlers");

const CATEGORY_NAME = "Characters";
const CATEGORY_DESCRIPTION = "";

const CLAIM_CHARACTERS_COMMAND = "claim";
const CLAIM_CHARACTER_DESCRIPTION = "";

const ASSIGN_CHARACTERS_COMMAND = "assign";
const ASSIGN_CHARACTERS_DESCRIPTION = "";

const SHOW_CLAIMS_COMMAND = "claims";
const SHOW_CLAIMS_DESCRIPTION = "";

const SHOW_UNREGISTERED_USERS_COMMAND = "users";
const SHOW_UNREGISTERED_USERS_DESCRIPTION = "";

const SHOW_ILVL_LEADERBOARD_COMMAND = "ilvl";
const SHOW_ILVL_LEADERBOARD_DESCRIPTION = "";

const INSPECT_CHARACTER_COMMAND = "inspect";
const INSPECT_CHARACTER_DESCRIPTION = "";

const NAMES_LIKE_COMMAND = "like";
const NAMES_LIKE_DESCRIPTION = "";

const commands = {
  [CLAIM_CHARACTERS_COMMAND]: {
    handler: characterHandlers.claimHandler,
    description: CLAIM_CHARACTER_DESCRIPTION
  },
  [ASSIGN_CHARACTERS_COMMAND]: {
    handler: characterHandlers.assignHandler,
    description: ASSIGN_CHARACTERS_DESCRIPTION,
    level: "moderator"
  },
  [SHOW_CLAIMS_COMMAND]: {
    handler: characterHandlers.showClaimsHandler,
    description: SHOW_CLAIMS_DESCRIPTION,
    level: "moderator"
  },
  [SHOW_UNREGISTERED_USERS_COMMAND]: {
    handler: characterHandlers.showUnregisteredUsers,
    description: SHOW_UNREGISTERED_USERS_DESCRIPTION,
    level: "moderator"
  },
  [SHOW_ILVL_LEADERBOARD_COMMAND]: {
    handler: characterHandlers.showIlvlLeaderboardHandler,
    description: SHOW_ILVL_LEADERBOARD_DESCRIPTION
  },
  [INSPECT_CHARACTER_COMMAND]: {
    handler: characterHandlers.inspectCharacter,
    description: INSPECT_CHARACTER_DESCRIPTION
  },
  [NAMES_LIKE_COMMAND]: {
    handler: characterHandlers.getNamesLike,
    description: NAMES_LIKE_DESCRIPTION
  }
};

module.exports = {
  name: CATEGORY_NAME,
  description: CATEGORY_DESCRIPTION,
  commands
};
