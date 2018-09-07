const config = require("../config");
const utils = require("../utils/utils");
const dbUtils = require("../utils/dbUtils");
const apiUtils = require("../utils/apiUtils");
const discordUtils = require("../utils/discordUtils");
const logger = require("../utils/logger");
const { getSpaces } = require("../utils/utils");

const createTeamHandler = (message, ...args) => {
  if (!discordUtils.isAdmin(message.member)) {
    return Promise.resolve();
  }
  if (!args[0] || args[0].length <= 0) {
    return message.reply("Please specify the team name");
  }
  const name = escape(args[0]);
  return dbUtils
    .createTeam(name)
    .then(() => {
      return message.reply(`Team "${name}" successfully created!`);
    })
    .catch(err => {
      if (err.code && err.code === 11000) {
        return message.reply(`Team "${name}" already exists!`);
      }
      return message.reply("An error has occured. Please try again");
    });
};
const addToTeamHandler = (message, ...args) => {
  if (!discordUtils.isAdmin(message.member)) {
    return Promise.resolve();
  }
  if (!args[0] || args[0].length <= 0) {
    return message.reply("Please specify the team name");
  }
  if (!args[1] || args[1].length <= 0) {
    return message.reply("Please specify at least one character name");
  }
  return dbUtils
    .addToTeam(args[0], args.slice(1).map(utils.getCharacterNameAndRealm))
    .then(res => {
      const replies = [];
      const { succeeded, failed } = res;
      if (failed && failed.length > 0) {
        replies.push(
          `Could not find ${failed.length} characters: ${failed
            .map(ch => `${ch.name}-${ch.realm}`)
            .join(", ")}`
        );
      }
      if (succeeded && succeeded.length > 0) {
        replies.push(
          `Added ${succeeded.length} characters: ${succeeded
            .map(ch => `${ch.name}-${ch.realm}`)
            .join(", ")}`
        );
      }
      return message.reply(
        replies.length <= 0
          ? "All characters are already added!"
          : replies.join("\n")
      );
    })
    .catch(err => {
      logger.error(err);
      return message.reply(`An error has occured! ${err.message}`);
    });
};
const removeFromTeamHandler = (message, ...args) => {};
const listTeamHandler = (message, ...args) => {
  if (!discordUtils.isModerator(message.member)) {
    return Promise.resolve();
  }
  if (!args[0] || args[0].length <= 0) {
    return message.reply("Please specify the team name");
  }
  let chars;
  return dbUtils
    .listTeam(args[0])
    .then(characters => {
      chars = characters;
      return dbUtils.getAllUsers();
    })
    .then(users => {
      const header = {
        number: "#",
        name: "Name",
        level: "Level",
        ilvl: "ilvle/ilvl",
        tag: "User Tag"
      };
      const getTag = char => {
        const user = users.find(u =>
          u.characters.find(ch => String(ch._id) === String(char._id))
        );
        if (!user) {
          return "";
        }
        return user.discordTag;
      };
      const mappedCharacters = chars
        .sort((c1, c2) => c2.ilvl - c1.ilvl)
        .map((char, idx) => ({
          number: idx + 1,
          name: `${char.name}-${char.realm}`,
          level: char.level,
          ilvl: `${char.ilvle}/${char.ilvl}`,
          tag: getTag(char)
        }));
      const descs = discordUtils.constructTables([header, ...mappedCharacters]);
      const embed = discordUtils.constructDefaultEmbed();
      embed.setTitle(
        `Team "${args[0]}"                                              `
      );
      embed.setColor(16042818);
      descs.forEach(desc => {
        embed.addField(
          "ASDASDASDASDASDASDASDADASDASDASDASDASDASDADASDASDADASDA",
          "```autohotkey\n" + desc + "```"
        );
      });
      return message.channel.send(embed);
    })
    .catch(err => {
      logger.error(err);
      return message.reply(`An error has occured! ${err.message}`);
    });
};

module.exports = {
  createTeamHandler,
  addToTeamHandler,
  removeFromTeamHandler,
  listTeamHandler
};
