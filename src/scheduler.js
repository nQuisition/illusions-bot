const moment = require("moment");
const dbUtils = require("./utils/dbUtils");
const discordUtils = require("./utils/discordUtils");

const tasks = [];
let started = false;
const checkInterval = 5 * 60 * 1000;

const execute = task => {
  if (task.type === "reminder") {
    const embed = discordUtils.constructDefaultEmbed(task.user);
    embed.setTitle(task.name);
    embed.setDescription(task.value);
    embed.setColor(3385907);
    task.user.send(embed);
  }
  dbUtils.completeTask(task._id);
  tasks.splice(tasks.findIndex(t => t._id === task._id), 1);
};

const schedule = task => {
  console.log(
    `Scheduling task ${task._id} to run in ${(task.startTime.getTime() -
      Date.now()) /
      1000} seconds`
  );
  setTimeout(() => {
    execute(task);
  }, task.startTime.getTime() - Date.now());
  task.scheduled = true;
};

const isReadyToBeScheduled = (task, timeNow = moment()) =>
  !task.scheduled &&
  moment(task.startTime).isBetween(
    timeNow,
    moment().add(checkInterval * 2, "ms")
  );

const createTask = (author, name, value, type, startTime, interval = 0) => {
  dbUtils
    .createTask(author.id, name, value, type, startTime, interval)
    .then(res => {
      res.user = author;
      res.scheduled = false;
      tasks.push(res);
      if (isReadyToBeScheduled(res)) {
        schedule(res);
      }
    });
};

const scheduleTasks = () => {
  const timeNow = moment();
  const toSchedule = tasks.filter(task => isReadyToBeScheduled(task, timeNow));
  toSchedule.forEach(task => {
    schedule(task);
  });
};

const cont = () => {
  scheduleTasks();
  setTimeout(cont, checkInterval);
};

const start = () => {
  if (started) {
    return;
  }
  dbUtils.getTasks().then(res => {
    tasks.push(
      ...res.map(r => ({
        ...r,
        user: discordUtils.findUserById(r.userId),
        scheduled: false
      }))
    );
    cont();
    started = true;
  });
};

module.exports = {
  createTask,
  start
};
