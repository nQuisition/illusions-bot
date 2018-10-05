const schedulerHandlers = require("./handlers/schedulerHandlers");

const CATEGORY_NAME = "Scheduler and Reminder";
const CATEGORY_DESCRIPTION = "";

const REMIND_COMMAND = "remind";
const REMIND_DESCRIPTION = "";

const commands = {
  [REMIND_COMMAND]: {
    handler: schedulerHandlers.reminderScheduler,
    description: REMIND_DESCRIPTION
  }
};

module.exports = {
  name: CATEGORY_NAME,
  description: CATEGORY_DESCRIPTION,
  commands
};
