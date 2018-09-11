const axios = require("axios");
const config = require("../config");

const githubApiUrl = "https://api.github.com/";
const labelsMap = {
  bug: { labels: ["bug"], titleText: "Bug report from" },
  suggest: { labels: ["suggestion"], titleText: "Suggestion from" },
  todo: { labels: ["todo"], titleText: "TODO by" }
};

const insertCheckboxes = message =>
  message
    .split(/\|/g)
    .map(s => s.trim())
    .filter(s => s && s.length > 0)
    .join("\n- [ ] ");

const createIssue = (author, message, type) => {
  const url = `${githubApiUrl}repos/${config.githubRepo}/issues?access_token=${
    config.githubAccessToken
  }`;
  const labelsInfo = labelsMap[type];
  let msg = message;
  if (message.indexOf("|") > 0) {
    msg = `- [ ] ${insertCheckboxes(message)}`;
  }
  const body = `**Submitted by**\n${author}\n\n**Content**\n${msg}`;
  const title = labelsInfo
    ? `${labelsInfo.titleText} ${author}`
    : `Issue submitted by ${author}`;
  const issue = { title, body };
  if (labelsInfo) {
    issue.labels = labelsInfo.labels;
  }
  return axios.post(url, issue);
};

const getAllIssuesOfType = (type, onlyOpen = true) => {
  let url = `${githubApiUrl}repos/${config.githubRepo}/issues`;
  const params = [];
  if (type && labelsMap[type]) {
    params.push(`labels=${labelsMap[type].labels.join(",")}`);
  }
  if (!onlyOpen) {
    params.push("state=all");
  }
  url += `${params.length > 0 ? "?" : ""}${params.join("&")}`;
  return axios.get(url).then(res => res.data);
};

const getLastTodo = () => getAllIssuesOfType("todo").then(res => res[0]);

const getIssue = number =>
  getAllIssuesOfType().then(res =>
    res.find(iss => iss.number === Number(number))
  );

const editIssueBody = (number, newBody) => {
  const url = `${githubApiUrl}repos/${
    config.githubRepo
  }/issues/${number}?access_token=${config.githubAccessToken}`;
  return axios.patch(url, { body: newBody });
};

const appendIssue = (number, message) => {
  let msg = message;
  if (message.indexOf("|") > 0) {
    msg = `- [ ] ${insertCheckboxes(message)}`;
  }
  return getIssue(number).then(issue => {
    if (!issue) {
      throw new Error(`Issue #${number} not found!`);
    }
    return editIssueBody(number, `${issue.body}\n${msg}`);
  });
};

const appendLastTodo = message => {
  let msg = message;
  if (message.indexOf("|") > 0) {
    msg = `- [ ] ${insertCheckboxes(message)}`;
  }
  return getLastTodo().then(todo => {
    if (!todo) {
      throw new Error("There is no TODO to append!");
    }
    return editIssueBody(todo.number, `${todo.body}\n${msg}`);
  });
};

module.exports = {
  createIssue,
  getAllIssuesOfType,
  appendIssue,
  appendLastTodo
};
