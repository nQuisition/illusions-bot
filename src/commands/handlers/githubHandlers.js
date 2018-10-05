const githubUtils = require("../../utils/githubUtils");
const discordUtils = require("../../utils/discordUtils");

const issueHandler = (type, message, ...args) => {
  if (args.length <= 0 || args[0].trim().length <= 0) {
    return discordUtils.replyAndReject(
      message,
      "Please provide description for the issue/suggestion"
    );
  }
  if (args[0].trim().toLowerCase() === "-list") {
    return githubUtils
      .getAllIssuesOfType(type)
      .then(res =>
        message.reply(
          res
            .map(
              issue =>
                `#${issue.number} - ${issue.milestone &&
                  issue.milestone.title} - ${issue.title}`
            )
            .join("\n")
        )
      )
      .catch(err =>
        discordUtils.replyAndReject(message, err.message || String(err), true)
      );
  }
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

const bugHandler = (message, flags, ...args) =>
  issueHandler("bug", message, ...args);
const suggestHandler = (message, flags, ...args) =>
  issueHandler("suggest", message, ...args);
const todoHandler = (message, flags, ...args) => {
  if (args[0] && args[0].toLowerCase() === "-append") {
    if (args.length <= 1 || args[1].trim().length <= 0) {
      return discordUtils.replyAndReject(
        message,
        "Please provide description for the issue/sugestion"
      );
    }
    return githubUtils
      .appendLastTodo(args.slice(1).join(" "))
      .then(res =>
        message.reply(
          `Issue successfully updated at ${res.data && res.data.html_url}`
        )
      )
      .catch(err =>
        discordUtils.replyAndReject(message, err.message || String(err), true)
      );
  }
  return issueHandler("todo", message, ...args);
};

module.exports = {
  bugHandler,
  suggestHandler,
  todoHandler
};
