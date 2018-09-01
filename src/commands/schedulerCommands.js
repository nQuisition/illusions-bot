const schedulerHandlers = require("./schedulerHandlers");

const REMIND_COMMAND = "remind";
const REMIND_DESCRIPTION = "";

const commands = {
  [REMIND_COMMAND]: {
    handler: schedulerHandlers.reminderScheduler,
    description: REMIND_DESCRIPTION
  }
};

module.exports = commands;
