const githubHandlers = require("./handlers/githubHandlers");

const CATEGORY_NAME = "GitHub";
const CATEGORY_DESCRIPTION = "";

const SUBMIT_BUG_COMMAND = "bug";
const SUBMIT_BUG_DESCRIPTION = "";

const SUBMIT_SUGGESTION_COMMAND = "suggest";
const SUBMIT_SUGGESTION_DESCRIPTION = "";

const SUBMIT_TODO_COMMAND = "todo";
const SUBMIT_TODO_DESCRIPTION = "";

const commands = {
  [SUBMIT_BUG_COMMAND]: {
    handler: githubHandlers.bugHandler,
    description: SUBMIT_BUG_DESCRIPTION
  },
  [SUBMIT_SUGGESTION_COMMAND]: {
    handler: githubHandlers.suggestHandler,
    description: SUBMIT_SUGGESTION_DESCRIPTION
  },
  [SUBMIT_TODO_COMMAND]: {
    handler: githubHandlers.todoHandler,
    description: SUBMIT_TODO_DESCRIPTION,
    level: "admin"
  }
};

module.exports = {
  name: CATEGORY_NAME,
  description: CATEGORY_DESCRIPTION,
  commands
};
