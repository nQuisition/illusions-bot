const characterCommands = require("./characterCommands");
const teamCommands = require("./teamCommands");
const schedulerCommands = require("./schedulerCommands");

const allCommands = {
  ...characterCommands,
  ...teamCommands,
  ...schedulerCommands
};

const execute = (cmd, message, ...args) => {
  const command = Object.keys(allCommands).find(
    key => key === cmd.toLowerCase()
  );
  if (!command) {
    return Promise.resolve("Unknown command");
  }
  return allCommands[command].handler(message, ...args);
};

module.exports = { execute };
