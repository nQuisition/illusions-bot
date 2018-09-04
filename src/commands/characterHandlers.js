const config = require("../config");
const utils = require("../utils/utils");
const dbUtils = require("../utils/dbUtils");
const apiUtils = require("../utils/apiUtils");
const discordUtils = require("../utils/discordUtils");
const logger = require("../utils/logger");
const { getSpaces } = require("../utils/utils");

// Returns array of fails
const claimOrAssignCharacters = (
  discordId,
  discordTag,
  characters,
  assign = false
) => {
  const processedCharacters = characters.map(utils.getCharacterNameAndRealm);
  const chars = [];
  const failed = [];
  return dbUtils
    .findOrAddUser(discordId, discordTag)
    .then(() =>
      Promise.all(
        processedCharacters.map(char =>
          apiUtils
            .getCharacter(char.name, char.realm)
            .then(res => {
              logger.info(`Got character ${res.name}`);
              chars.push(res);
              return Promise.resolve();
            })
            .catch(err => {
              logger.warn(
                `Error getting character ${char.name}! Status ${
                  err.response.status
                }`
              );
              if (err.response && err.response.status === 404) {
                failed.push({
                  character: char.request,
                  error: err,
                  type: "NOTFOUND"
                });
              } else {
                failed.push({
                  character: char.request,
                  error: err,
                  type: "UNKNOWN"
                });
              }
              return Promise.resolve();
            })
        )
      )
    )
    .then(() => {
      if (!assign) {
        return dbUtils.claimApiCharacters(discordId, chars);
      }
      return dbUtils.assignApiCharacters(discordId, chars);
    })
    .then(user => ({ user, failed }))
    .catch(err => {
      logger.error(err);
    });
};

const claimHandler = (message, ...args) => {
  if (args.length <= 0) {
    logger.info("No characters specified");
    return Promise.resolve();
  }
  const { author } = message;
  return claimOrAssignCharacters(author.id, author.tag, args).then(res => {
    const { failed } = res;
    logger.info(`Failed ${failed.length}`);
    let msg = "Done!";
    if (failed.length > 0) {
      msg = `Could not claim the following character(s): ${failed
        .map(c => c.character)
        .join(", ")}. please check your spelling!`;
    }
    return message.reply(msg);
  });
};

const assignHandler = (message, ...args) => {
  if (!discordUtils.isModerator(message.member)) {
    return Promise.resolve();
  }
  if (args.length <= 1) {
    logger.info("No user and/or characters specified");
    return Promise.resolve();
  }
  const discordUser = discordUtils.findUserByName(args[0], message.member);
  if (!discordUser) {
    logger.info(`Cannot find user with name ${args[0]}`);
    return message.reply(`User with name or tag ${args[0]} does not exist!`);
  }

  return claimOrAssignCharacters(
    discordUser.id,
    discordUser.tag,
    args.slice(1),
    true
  ).then(res => {
    const { user, failed } = res;
    logger.info(`Failed ${failed.length}`);
    let msg = "Done!";
    if (failed.length > 0) {
      msg = `Could not claim the following character(s): ${failed
        .map(c => c.character)
        .join(", ")}. please check your spelling!`;
    }
    return message.reply(msg);
  });
};

const showClaimsHandler = (message, ...args) => {
  if (!discordUtils.isModerator(message.member)) {
    return Promise.resolve();
  }
  const userName = args[0];
  if (!userName) {
    return dbUtils
      .getCharacterClaims()
      .then(claims =>
        message.reply(
          `The following character(s) were claimed: ${claims
            .map(c => c.character.name)
            .join(", ")}`
        )
      );
  }
  const user = discordUtils.findUserByName(userName, message.member);
  if (!user) {
    logger.info(`Cannot find user with name ${userName}`);
    return message.reply(`User with name or tag ${userName} does not exist!`);
  }

  return dbUtils
    .getCharacterClaims(user.id)
    .then(claims =>
      message.reply(
        `User ${userName} has claimed the following character(s): ${claims
          .map(c => c.character.name)
          .join(", ")}`
      )
    );
};

const showIlvlLeaderboardHandler = (message, ...args) => {
  // FIXME validate that it is a number!
  const limit = args[0] || 10;
  return apiUtils.getLeaderboard("ilvl", limit).then(chars => {
    const maxLength = chars.reduce(
      (max, char) => (char.name.length > max ? char.name.length : max),
      0
    );
    const desc = chars.reduce(
      (str, char) => (
        (str += `${char.name}${getSpaces(maxLength - char.name.length)} - ${
          char.ilvl
        }\n`),
        str
      ),
      ""
    );
    const embed = discordUtils.constructDefaultEmbed();
    embed.setTitle("Item level leaders");
    embed.setColor(16042818);
    embed.setDescription("```___________________________\n" + desc + "```");
    return message.channel.send(embed);
  });
};

const getProgressionString = raid => {
  let res = `\`\`\`autohotkey\nProgression: ${raid.normal.bosses}/${
    raid.normal.total
  }N, ${raid.heroic.bosses}/${raid.heroic.total}H, ${raid.mythic.bosses}/${
    raid.mythic.total
  }M\n`;
  res += `Total kills: ${raid.normal.kills}N, ${raid.heroic.kills}H, ${
    raid.mythic.kills
  }M\`\`\``;
  return res;
};
const inspectCharacter = (message, ...args) => {
  if (args.length <= 0) {
    return message.reply("Please specify a character or armory URL");
  }
  let name;
  let realm;
  if (args[0].startsWith("https://worldofwarcraft.com/")) {
    const invalidUrl = () => {
      return message.reply("Invalid URL!");
    };
    const toSearch = "character/";
    const pos = args[0].indexOf(toSearch);
    if (pos < 0) {
      return invalidUrl();
    }
    const str = args[0].substring(pos + toSearch.length);
    const pos2 = str.indexOf("/");
    if (pos2 < 0) {
      return invalidUrl();
    }
    realm = str.substring(0, pos2);
    name = str.substring(pos2 + 1);
  } else {
    const dashPos = args[0].indexOf("-");
    name = args[0];
    realm = config.defaultRealm;
    if (dashPos > 0) {
      name = args[0].substring(0, dashPos);
      realm = args[0].substring(dashPos + 1);
    }
  }
  return apiUtils
    .getProgression(name, realm)
    .then(char => {
      const embed = discordUtils.constructDefaultEmbed();
      embed.setTitle(
        `${char.name}-${char.realm}                                        `
      );
      embed.setDescription(
        `\`\`\`autohotkey\n${char.level} ${char.spec} - ${char.ilvle}/${
          char.ilvl
        }\`\`\``
      );
      char.progression.forEach(raid => {
        embed.addField(raid.name, getProgressionString(raid));
      });
      embed.setColor(16042818);
      return message.channel.send(embed);
    })
    .catch(err => {
      if (err.response && err.response.status === 404) {
        return message.reply("Character not found!");
      }
      return message.reply("An error has occured!");
    });
};

module.exports = {
  claimHandler,
  assignHandler,
  showClaimsHandler,
  showIlvlLeaderboardHandler,
  inspectCharacter
};
