const { Sequelize } = require("sequelize");
const config = require("./common/getConfig")();

module.exports = new Sequelize(config.CLEARDB_DATABASE_URL);
