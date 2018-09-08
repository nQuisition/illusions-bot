const githubUtils = require("../utils/githubUtils");
const discordUtils = require("../utils/discordUtils");

const issueHandler = (type, message, ...args) => {
  const author = message.author.tag;
  const msg = args.join(" ");
  return githubUtils
    .createIssue(author, msg, type)
    .then(res =>
      message.reply(
        `Issue successfully created at ${res.data && res.data.html_url}`
      )
    )
    .catch(err =>
      discordUtils.replyAndReject(message, err.message || String(err), true)
    );
};

const bugHandler = (message, ...args) => issueHandler("bug", message, ...args);
const suggestHandler = (message, ...args) =>
  issueHandler("suggest", message, ...args);
const todoHandler = (message, ...args) =>
  issueHandler("todo", message, ...args);

module.exports = {
  bugHandler,
  suggestHandler,
  todoHandler
};
