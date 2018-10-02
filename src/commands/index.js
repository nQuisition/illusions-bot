const discordUtils = require("../utils/discordUtils");

const characterCommands = require("./characterCommands");
const teamCommands = require("./teamCommands");
const schedulerCommands = require("./schedulerCommands");
const githubCommands = require("./githubCommands");
const utilityCommands = require("./utilityCommands");

const allCategories = [
  characterCommands,
  teamCommands,
  schedulerCommands,
  githubCommands,
  utilityCommands
];

const allCommands = allCategories.reduce(
  (obj, cat) => ({ ...obj, ...cat.commands }),
  {}
);

const permissionCheckers = {
  moderator: discordUtils.isModerator,
  admin: discordUtils.isAdmin
};

const getAccessibleSubset = (cat, member) => {
  const { commands, ...restOfCat } = cat;
  const cmds = Object.keys(commands).reduce((obj, c) => {
    const cmd = commands[c];
    if (!cmd.level || permissionCheckers[cmd.level](member)) {
      obj[c] = cmd;
    }
    return obj;
  }, {});
  restOfCat.commands = cmds;
  return restOfCat;
};

const execute = (cmd, message, ...args) => {
  if (cmd.toLowerCase() === "commands") {
    const embed = discordUtils.constructDefaultEmbed();
    allCategories
      .map(cat => getAccessibleSubset(cat, message.member))
      .filter(cat => Object.keys(cat.commands).length > 0)
      .forEach(cat => {
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
  const commandObject = allCommands[command];
  if (
    commandObject.level &&
    !permissionCheckers[commandObject.level](message.member)
  ) {
    return Promise.reject(new Error("Forbidden"));
  }
  return allCommands[command].handler(message, ...args);
};

module.exports = { execute };
