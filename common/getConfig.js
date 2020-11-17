require("dotenv").config();

module.exports = function getConfig() {
  return {
    PREFIX: process.env.PREFIX || "|",
    TOKEN: process.env.BOT_TOKEN,
  };
};
