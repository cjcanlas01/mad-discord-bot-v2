const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  config.database,
  config.user,
  config.password,
  config
);
