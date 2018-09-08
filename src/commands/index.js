const discordUtils = require("../utils/discordUtils");

const characterCommands = require("./characterCommands");
const teamCommands = require("./teamCommands");
const schedulerCommands = require("./schedulerCommands");
const githubCommands = require("./githubCommands");

const allCategories = [
  characterCommands,
  teamCommands,
  schedulerCommands,
  githubCommands
];

const allCommands = allCategories.reduce(
  (obj, cat) => ({ ...obj, ...cat.commands }),
  {}
);

const execute = (cmd, message, ...args) => {
  if (cmd.toLowerCase() === "commands") {
    const embed = discordUtils.constructDefaultEmbed();
    allCategories.forEach(cat => {
      embed.addField(
        cat.name,
        Object.keys(cat.commands)
          .sort((a, b) => a.localeCompare(b))
          .join(", ")
      );
    });
    return message.reply(embed);
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
