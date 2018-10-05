const teamHandlers = require("./handlers/teamHandlers");

const CATEGORY_NAME = "Teams";
const CATEGORY_DESCRIPTION = "";

const ROOT_TEAM_COMMAND = "team";
const ROOT_TEAM_DESCRIPTION = "";

const CREATE_TEAM_COMMAND = "create";
const CREATE_TEAM_DESCRIPTION = "";

const ADD_TO_TEAM_COMMAND = "add";
const ADD_TO_TEAM_DESCRIPTION = "";

const LIST_TEAM_COMMAND = "list";
const LIST_TEAM_DESCRIPTION = "";

const rootTeamSubcommands = {
  [CREATE_TEAM_COMMAND]: {
    handler: teamHandlers.createTeamHandler,
    description: CREATE_TEAM_DESCRIPTION
  },
  [ADD_TO_TEAM_COMMAND]: {
    handler: teamHandlers.addToTeamHandler,
    description: ADD_TO_TEAM_DESCRIPTION
  },
  [LIST_TEAM_COMMAND]: {
    handler: teamHandlers.listTeamHandler,
    description: LIST_TEAM_DESCRIPTION
  }
};

const commands = {
  [ROOT_TEAM_COMMAND]: {
    description: ROOT_TEAM_DESCRIPTION,
    level: "moderator",
    subcommands: rootTeamSubcommands
  }
};

module.exports = {
  name: CATEGORY_NAME,
  description: CATEGORY_DESCRIPTION,
  commands
};
