const characterCommands = require("./characterCommands");
const teamCommands = require("./teamCommands");
const schedulerCommands = require("./schedulerCommands");

const allCommands = {
  ...characterCommands,
  ...teamCommands,
  ...schedulerCommands
};

const execute = (cmd, message, ...args) => {
  if (cmd.toLowerCase() === "commands") {
    return message.reply(
      Object.keys(allCommands)
        .sort((a, b) => a.localeCompare(b))
        .join(", ")
    );
  }
  const command = Object.keys(allCommands).find(
    key => key === cmd.toLowerCase()
  );
  if (!command) {
    return Promise.reject(new Error("Unknown command"));
  }
  return allCommands[command].handler(message, ...args);
};

module.exports = { execute };
