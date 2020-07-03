/**
 * Displays all commands of discord MAD bot
 */
const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();

module.exports = {
  name: "banners",
  description: "Show banner commands.",
  syntax: `${config.PREFIX1}banners`,
  includes: true,
  execute(message) {
    const { commands } = message.client;
    const json = commands
      .filter((val) => {
        if (val["banners"]) {
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
        "Banner Commands!",
        "MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD!"
      )
    );
  },
};
