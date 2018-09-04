const User = require("../db/models/userSchema");
const CharacterClaim = require("../db/models/characterClaimSchema");
const Team = require("../db/models/teamSchema");
const Task = require("../db/models/taskSchema");
const apiUtils = require("./apiUtils");
const logger = require("./logger");

const addUser = (discordId, discordTag) => {
  const newUser = new User({ _id: discordId, discordTag });
  return newUser.save();
};

const findOrAddUser = (discordId, discordTag) =>
  User.findOne({ _id: discordId }).then(user => {
    if (!user) {
      return addUser(discordId, discordTag);
    }
    return user;
  });

const createCharacterClaim = (discordId, characterId, date = Date.now()) =>
  new CharacterClaim({
    userId: discordId,
    claimedCharacterId: characterId,
    added: date
  });

// Ignores existing userId-characterId pairs
const claimApiCharacters = (discordId, apiCharacters) => {
  const date = Date.now();
  const claims = apiCharacters.map(char =>
    createCharacterClaim(discordId, char._id, date)
  );
  return CharacterClaim.insertMany(claims, { ordered: false }).catch(() =>
    Promise.resolve()
  );
};

const assignApiCharacters = (discordId, apiCharacters) =>
  User.findOne({ _id: discordId }).then(user => {
    if (!user) {
      throw new Error("User not found");
    }
    const stringIds = user.characters.map(ch => ch._id).map(String);
    const toAdd = apiCharacters.filter(char => !stringIds.includes(char._id));
    user.characters.push(
      ...toAdd.map(char => ({
        _id: char._id,
        name: char.name,
        realm: char.realm
      }))
    );
    logger.info(user.rank || 10);
    toAdd.forEach(char => {
      console.log(char.rank);
    });

    user.rank = Math.min(
      user.rank || 10,
      toAdd.reduce((min, char) => (char.rank < min ? char.rank : min), 10)
    );
    if (user.rank < 0) {
      user.rank = 100;
    }
    return user.save();
  });

const getCharacterClaims = discordId => {
  const query = {};
  if (discordId) {
    query.userId = discordId;
  }
  return CharacterClaim.find(query).then(res =>
    apiUtils
      .getCharactersById(res.map(claim => claim.claimedCharacterId))
      .then(chars =>
        chars.characters.map(char => ({
          ...res.find(r => r.claimedCharacterId === char._id),
          character: char
        }))
      )
  );
};

const createTeam = name => {
  const team = new Team({ name, characters: [] });
  return team.save();
};

const addToTeam = (name, characterNamesAndRealms) => {
  let dbTeam;
  const failed = [];
  const succeeded = [];
  return Team.findOne({ name }).then(team => {
    if (!team) {
      throw new Error("Team with specified name does not exist");
    }
    dbTeam = team;

    // TODO add ability to send array of characters on backend
    return Promise.all(
      characterNamesAndRealms.map(ch =>
        apiUtils.getCharacter(ch.name, ch.realm).catch(() => {
          failed.push(ch);
        })
      )
    )
      .then(res => {
        const stringIds = dbTeam.characters.map(ch => ch._id).map(String);
        succeeded.push(...res.filter(r => r && !stringIds.includes(r._id)));
        dbTeam.characters.push(...succeeded);
        return dbTeam.save();
      })
      .then(() => ({
        succeeded,
        failed
      }));
  });
};

const listTeam = name => {
  return Team.findOne({ name }).then(team => {
    if (!team) {
      throw new Error("Team with specified name does not exist");
    }
    return apiUtils
      .getCharactersById(team.characters.map(char => char._id))
      .then(res => {
        if (res.notFound && res.notFound.length > 0) {
          logger.warn(`Cannot retrieve characters ${res.notFound.join("; ")}`);
        }
        return res.characters;
      });
  });
};

const createTask = (userId, name, value, type, startTime, interval) => {
  const task = {
    userId,
    name,
    value,
    type,
    startTime,
    added: Date.now(),
    repeatable: false
  };
  if (interval && interval > 0) {
    task.repeatable = true;
    task.interval = interval;
  }
  return new Task(task).save();
};

const getTasks = () =>
  Task.find({ completed: false }, "", { lean: true }).exec();

const completeTask = id =>
  Task.update({ _id: id }, { $set: { completed: true } }).exec();

module.exports = {
  addUser,
  findOrAddUser,
  claimApiCharacters,
  assignApiCharacters,
  getCharacterClaims,
  createTeam,
  addToTeam,
  listTeam,
  createTask,
  getTasks,
  completeTask
};
