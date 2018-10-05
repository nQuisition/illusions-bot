const utilityHandlers = require("./handlers/utilityHandlers");

const CATEGORY_NAME = "Utility";
const CATEGORY_DESCRIPTION = "";

const FANCY_LETTERS_COMMAND = "fancyletters";
const FANCY_LETTERS_DESCRIPTION = "";

const commands = {
  [FANCY_LETTERS_COMMAND]: {
    handler: utilityHandlers.showDiactricLettersHandler,
    description: FANCY_LETTERS_DESCRIPTION
  }
};

module.exports = {
  name: CATEGORY_NAME,
  description: CATEGORY_DESCRIPTION,
  commands
};
