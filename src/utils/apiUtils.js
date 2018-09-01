const axios = require("axios");
const config = require("../config");

const getFromApi = (endpoint, params) => {
  const paramString = params
    ? `?${Object.keys(params)
        .map(key => {
          if (Array.isArray(params[key])) {
            return params[key].map(param => `${key}=${param}`).join("&");
          }
          return `${key}=${params[key]}`;
        })
        .join("&")}`
    : "";
  return axios
    .get(`${config.apiURL}/${endpoint}${paramString}`)
    .then(res => res.data);
};

// FIXME uhhhh
const getCharacter = (name, realm) =>
  getFromApi("character", { name, realm }).then(res => res.characters[0]);

const getCharactersById = id => getFromApi("character", { id });

const leaderboardHandlers = {
  ilvl: "guild/ilvl"
};

const getLeaderboard = (context, limit) =>
  getFromApi(leaderboardHandlers[context], { limit });

const getProgression = (name, realm) =>
  getFromApi("progression", { name, realm });

module.exports = {
  getCharacter,
  getCharactersById,
  getLeaderboard,
  getProgression
};
