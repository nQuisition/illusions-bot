const githubUtils = require("../../utils/githubUtils");
const discordUtils = require("../../utils/discordUtils");

const issueHandler = (type, message, flags, ...args) => {
  // TODO move this to separate subcommand?
  if (flags.includes("-l") || flags.includes("--list")) {
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
  if (args.length <= 0 || args[0].trim().length <= 0) {
    return discordUtils.replyAndReject(
      message,
      "Please provide description for the issue/suggestion"
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
  issueHandler("bug", message, flags, ...args);
const suggestHandler = (message, flags, ...args) =>
  issueHandler("suggest", message, flags, ...args);
const todoHandler = (message, flags, ...args) => {
  if (flags.includes("-a") || flags.includes("--append")) {
    if (args.length <= 0 || args[0].trim().length <= 0) {
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
  return issueHandler("todo", message, flags, ...args);
};

module.exports = {
  bugHandler,
  suggestHandler,
  todoHandler
};
