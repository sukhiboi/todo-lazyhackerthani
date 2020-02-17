const DATA_STORE_PATH =
  process.env.DATA_STORE_PATH || `${__dirname}/data/datastore.json`;
const USERS_PATH = process.env.USERS_PATH || `${__dirname}/data/users.json`;
module.exports = { DATA_STORE_PATH, USERS_PATH };
