require("dotenv").config();

module.exports = function getConfig() {
  return {
    PREFIX1: process.env.PREFIX1 || "!",
    TOKEN: process.env.BOT_TOKEN,
  };
};
