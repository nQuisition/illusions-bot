const teamHandlers = require("./teamHandlers");

const ROOT_TEAM_COMMAND = "team";
const ROOT_TEAM_DESCRIPTION = "";

const CREATE_TEAM_COMMAND = "create";
const CREATE_TEAM_DESCRIPTION = "";

const ADD_TO_TEAM_COMMAND = "add";
const ADD_TO_TEAM_DESCRIPTION = "";

const LIST_TEAM_COMMAND = "list";
const LIST_TEAM_DESCRIPTION = "";

const rootHandler = (message, ...args) => {
  const subcommand = args[0];
  if (!subcommand || subcommand.length <= 0) {
    return Promise.resolve();
  }
  switch (subcommand.toLowerCase()) {
    case CREATE_TEAM_COMMAND: {
      return teamHandlers.createTeamHandler(message, ...args.slice(1));
    }
    case ADD_TO_TEAM_COMMAND: {
      return teamHandlers.addToTeamHandler(message, ...args.slice(1));
    }
    case LIST_TEAM_COMMAND: {
      return teamHandlers.listTeamHandler(message, ...args.slice(1));
    }
    default: {
      return Promise.resolve();
    }
  }
};

const commands = {
  [ROOT_TEAM_COMMAND]: {
    handler: rootHandler,
    description: ROOT_TEAM_DESCRIPTION
  }
};

module.exports = commands;
