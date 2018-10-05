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
      if (cmd.handler) {
        obj[c] = cmd; // eslint-disable-line no-param-reassign
      }
      if (cmd.subcommands) {
        Object.keys(cmd.subcommands).forEach(subcmdName => {
          const subcmd = cmd.subcommands[subcmdName];
          if (!subcmd.level || permissionCheckers[subcmd.level](member)) {
            obj[`${c} ${subcmdName}`] = subcmd; // eslint-disable-line no-param-reassign
          }
        });
      }
    }
    return obj;
  }, {});
  restOfCat.commands = cmds;
  return restOfCat;
};

// Only considering flag before the first non-flag, ie before word without a dash
const separateArgsIntoFlagsAndParams = (...args) => {
  const flags = [];
  let params;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith("-")) {
      flags.push(args[i]);
    } else {
      // no more flags!
      params = args.slice(i);
      break;
    }
  }
  return { flags, params };
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

  let commandObject = allCommands[command];
  let processedArgs = args;

  if (
    commandObject.level &&
    !permissionCheckers[commandObject.level](message.member)
  ) {
    return Promise.reject(new Error("Forbidden"));
  }

  if (commandObject.subcommands) {
    if (
      !commandObject.handler &&
      (!args[0] || !commandObject.subcommands[args[0]])
    ) {
      return Promise.reject(new Error("Unknown subcommand"));
    }
    if (args[0] && commandObject.subcommands[args[0]]) {
      commandObject = commandObject.subcommands[args[0]];
      processedArgs = args.slice(1);
      // TODO repeated, ugly
      if (
        commandObject.level &&
        !permissionCheckers[commandObject.level](message.member)
      ) {
        return Promise.reject(new Error("Forbidden"));
      }
    }
  }

  const { flags, params } = separateArgsIntoFlagsAndParams(processedArgs);
  return allCommands[command].handler(message, flags, ...params);
};

module.exports = { execute };
