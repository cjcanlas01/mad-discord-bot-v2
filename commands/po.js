/**
 * Displays all commands of discord MAD bot
 */
const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();

module.exports = {
  name: "po",
  description: "Show PO-related commands.",
  syntax: `${config.PREFIX1}po`,
  includes: true,
  execute(message) {
    const { commands } = message.client;
    const json = commands
      .filter((val) => {
        if (val["po"]) {
          return val;
        }
      })
      .map((val) => {
        return {
          name: val.syntax,
          value: val.description,
        };
      });

    message.author.send(
      embed(
        json,
        "PO Commands!",
        "MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD!"
      )
    );
  },
};
