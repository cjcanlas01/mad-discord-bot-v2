const config = require("../common/getConfig")();
const embed = require("../common/discordEmbed");

module.exports = {
  name: "help",
  description: "Display some bot info.",
  syntax: `${config.PREFIX}help`,
  includes: false,
  execute(message) {
    const { commands } = message.client;
    const json = commands
      .filter((val) => {
        if (val["includes"]) {
          return val;
        }
      })
      .map((val) => {
        return {
          name: val.syntax,
          value: val.description,
        };
      });

    message.author.send(embed(json));
  },
};
