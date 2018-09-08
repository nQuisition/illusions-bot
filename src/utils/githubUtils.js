const axios = require("axios");
const config = require("../config");

const githubApiUrl = "https://api.github.com/";
const labelsMap = {
  bug: { labels: ["bug"], titleText: "Bug report from" },
  suggest: { labels: ["suggestion"], titleText: "Suggestion from" },
  todo: { labels: ["todo"], titleText: "TODO by" }
};

const createIssue = (author, message, type) => {
  const url = `${githubApiUrl}repos/${config.githubRepo}/issues?access_token=${
    config.githubAccessToken
  }`;
  const labelsInfo = labelsMap[type];
  const body = `**Submitted by**\n${author}\n\n**Content**\n${message}`;
  const title = labelsInfo
    ? `${labelsInfo.titleText} ${author}`
    : `Issue submitted by ${author}`;
  const issue = { title, body };
  if (labelsInfo) {
    issue.labels = labelsInfo.labels;
  }
  return axios.post(url, issue);
};

module.exports = {
  createIssue
};
