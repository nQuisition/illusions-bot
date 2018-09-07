const Discord = require("discord.js");
const logger = require("./utils/logger");
const commands = require("./commands/index");
const discordUtils = require("./utils/discordUtils");
const scheduler = require("./scheduler");
const settings = require("./settings.json");

const bot = new Discord.Client();
bot.on("ready", () => {
  logger.info("Connected");
  logger.info(`Logged in as: ${bot.user.tag} - (${bot.user.username})`);
  discordUtils.setBot(bot);
  scheduler.start();
});

bot.on("error", error => {
  logger.error(`Connection error! ${error.message}`);
});

bot.on("message", message => {
  if (message.channel instanceof Discord.DMChannel) {
    logger.info(
      `Got DM message from ${message.author.tag}: "${message.content}"`
    );
    return;
  }
  if (message.author.bot || !message.member) {
    return;
  }
  if (settings.modOnly && !discordUtils.isModerator(message.member)) {
    return;
  }
  if (message.content.substring(0, 1) === "!") {
    logger.debug(
      `Got message "${message.content}" from "${
        message.author.tag
      }" in channel "${message.channel.name}"`
    );
    const args = message.content.substring(1).split(" ");
    const cmd = args[0];

    commands.execute(cmd, message, ...args.slice(1));
  }
});

module.exports = bot;
