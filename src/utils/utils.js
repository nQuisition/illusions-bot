const config = require("../config");

const getSpaces = num => {
  let str = "";
  for (let i = 0; i < num; i++) {
    str += " ";
  }
  return str;
};

const getCharacterNameAndRealm = character => {
  const dashIdx = character.indexOf("-");
  const characterName =
    dashIdx >= 0 ? character.substring(0, dashIdx) : character;
  const characterRealm =
    dashIdx >= 0 ? character.substring(dashIdx + 1) : config.defaultRealm;
  return {
    request: character,
    name: characterName,
    realm: characterRealm
  };
};

module.exports = {
  getSpaces,
  getCharacterNameAndRealm
};
