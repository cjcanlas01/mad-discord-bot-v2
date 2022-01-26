const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const { Sequelize } = require("sequelize");

let sequelize;

if (config && config.use_env_variable) {
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    config
  );
}

module.exports = sequelize;
