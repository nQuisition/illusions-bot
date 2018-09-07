const Discord = require("discord.js");
const utils = require("./utils");
const logger = require("./logger");
const { rolesMap } = require("../settings.json");

// TODO ugly?!
let bot;
const setBot = b => {
  bot = b;
};

const isModerator = member =>
  member.hasPermission(Discord.Permissions.FLAGS.MANAGE_MESSAGES);

const isAdmin = member =>
  member.hasPermission(Discord.Permissions.FLAGS.MANAGE_GUILD);

// TODO rename this and similar to find*Member*ByName
const findUserByName = (name, searcherMember) => {
  const { members } = searcherMember.guild;
  let match = members.find(member => member.displayName === name);
  if (!match) {
    match = members.find(member => member.user.tag === name);
  }
  return match;
};

const findMemberById = (id, searcherMember) =>
  searcherMember.guild.members.find(member => member.id === id);

const assignRoleBasedOnRank = (member, rank) => {
  const relevantRoles = Object.values(rolesMap).reduce((arr, r) => {
    if (!arr.includes(r)) {
      arr.push(r);
    }
    return arr;
  }, []);
  const roleName = rolesMap[rank];
  const role = member.guild.roles.find(r => r.name === roleName);
  if (!role) {
    logger.warn(`Role for rank ${rank} not found!`);
    return Promise.resolve();
  }
  const index = relevantRoles.indexOf(roleName);
  if (
    member.roles.find(
      r =>
        relevantRoles.includes(r.name) && relevantRoles.indexOf(r.name) <= index
    )
  ) {
    logger.info("Member has an equal/higher role!");
    return Promise.resolve();
  }
  const toRemove = member.roles.filter(
    r => relevantRoles.includes(r.name) && relevantRoles.indexOf(r.name) > index
  );
  return member.addRole(role).then(() => member.removeRoles(toRemove));
};

const findUserById = id => bot.users.find("id", id);

const getAllUserTags = searcherMember =>
  searcherMember.guild.members.map(m => ({
    id: m.id,
    name: m.displayName,
    tag: m.user.tag
  }));

const constructTable = (data, showHeader = true) => {
  const header = data[0];
  const rows = data.slice(1);
  const keys = Object.keys(header);
  const columns = {};
  if (showHeader) {
    keys.forEach(key => {
      columns[key] = { data: [header[key]], maxLength: header[key].length };
    });
  }
  rows.forEach(row => {
    keys.forEach(key => {
      columns[key].data.push(row[key]);
      if (columns[key].maxLength < String(row[key]).length) {
        columns[key].maxLength = String(row[key]).length;
      }
    });
  });
  let res = "";
  for (let i = 0; i < data.length; i++) {
    keys.forEach(key => {
      res +=
        columns[key].data[i] +
        utils.getSpaces(
          columns[key].maxLength - String(data[i][key]).length + 1
        );
    });
    res += "\n";
  }
  return res;
};

const constructTables = (data, chunkSize = 10) => {
  const header = data[0];
  const rows = data.slice(1);
  const groups = [];
  for (let i = 0; i < rows.length; i += chunkSize) {
    groups.push([header, ...rows.slice(i, i + chunkSize)]);
  }
  return groups.map(gr => constructTable(gr));
};

const constructDefaultEmbed = (user = bot.user) => {
  const embed = new Discord.RichEmbed();
  embed.setAuthor(user.username, user.avatarURL);
  embed.setFooter("© Illusions");
  embed.setTimestamp(Date.now());
  return embed;
};

const replyAndReject = (message, errorMessage, isError = false) => {
  if (isError) {
    logger.error(errorMessage);
  } else {
    logger.info(errorMessage);
  }
  return message
    .reply(errorMessage)
    .then(() => Promise.reject(new Error(errorMessage)));
};

module.exports = {
  setBot,
  isModerator,
  isAdmin,
  findUserByName,
  findMemberById,
  findUserById,
  getAllUserTags,
  assignRoleBasedOnRank,
  constructDefaultEmbed,
  constructTables,
  replyAndReject
};
