const config = require("../../config");
const utils = require("../../utils/utils");
const dbUtils = require("../../utils/dbUtils");
const scheduler = require("../../scheduler");
const apiUtils = require("../../utils/apiUtils");
const discordUtils = require("../../utils/discordUtils");
const logger = require("../../utils/logger");
const { getSpaces } = require("../../utils/utils");

const numbersRegex = /(\d+)/;
const intervalsMap = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000
};

const computeDateFromNow = str => {
  if (str.includes("-")) {
    const parts = str.split("-");
    if (parts[0].toLowerCase() === "tomorrow") {
    }
  } else {
    const parts = str.split(numbersRegex).filter(s => s !== "");
    if (!parts[0] || !intervalsMap[parts[1]]) {
      return null;
    }
    return new Date(Date.now() + parts[0] * intervalsMap[parts[1]]);
  }
};

const reminderScheduler = (message, flags, ...args) => {
  const startTime = computeDateFromNow(args[0]);
  if (!startTime) {
    return discordUtils.replyAndReject(message, "Incorrect time interval!");
  }
  return scheduler.createTask(
    message.author,
    "Reminder",
    args.slice(1).join(" "),
    "reminder",
    startTime,
    0
  );
};

module.exports = {
  reminderScheduler
};
