/**
 * Displays all commands of discord MAD bot
 */
const commands = require("../common/getSillyMessages");
const config = require("../common/getConfig")();

module.exports = {
  name: "commands",
  description: "Shows list of extra commands.",
  syntax: `${config.PREFIX}commands`,
  includes: true,
  execute(message) {
    const keys = Array.from(commands().keys());
    message.author.send(
      "**Current existing commands! Try them and be entertained!**"
    );
    message.author.send("**HOW? Use ![command]**");
    message.author.send(keys);
  },
};
