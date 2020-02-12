const DATA_STORE_PATH =
  process.env.DATA_STORE_PATH ||
  `${__dirname}/src/server/assets/datastore.json`;
module.exports = DATA_STORE_PATH;
