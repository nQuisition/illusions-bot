const mongoose = require("mongoose");

const bot = require("./discord");
const config = require("./config");

const githubUtils = require("./utils/githubUtils");

// TODO had to put retryWrites to false to make index creation work...
// Will not need index creating by mongoose in production though
mongoose.connect(
  `mongodb+srv://${config.dbUser}:${config.dbPassword}@${
    config.dbAddress
  }?retryWrites=false`
);

bot.login(config.discordToken);
