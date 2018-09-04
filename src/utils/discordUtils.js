const Discord = require("discord.js");
const utils = require("./utils");

// TODO ugly?!
let bot;
const setBot = b => {
  bot = b;
};

const isModerator = member =>
  member.hasPermission(Discord.Permissions.FLAGS.MANAGE_MESSAGES);

const isAdmin = member =>
  member.hasPermission(Discord.Permissions.FLAGS.MANAGE_GUILD);

const findUserByName = (name, searcher) => {
  const { members } = searcher.guild;
  let match = members.find(member => member.displayName === name);
  if (!match) {
    match = members.find(member => member.user.tag === name);
  }
  return match && { ...match, tag: match.user.tag };
};

const findUserById = id => bot.users.find("id", id);

const constructTable = data => {
  const header = data[0];
  const rows = data.slice(1);
  const keys = Object.keys(header);
  const columns = {};
  keys.forEach(key => {
    columns[key] = { data: [header[key]], maxLength: header[key].length };
  });
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

const constructDefaultEmbed = (user = bot.user) => {
  const embed = new Discord.RichEmbed();
  embed.setAuthor(user.username, user.avatarURL);
  embed.setFooter("© Illusions");
  embed.setTimestamp(Date.now());
  return embed;
};

module.exports = {
  setBot,
  isModerator,
  isAdmin,
  findUserByName,
  findUserById,
  constructDefaultEmbed,
  constructTable
};
