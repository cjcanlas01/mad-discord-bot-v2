const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();
const m = require("../models/index");

const isArrayEmpty = (arr) => {
  if (arr.length == 0) {
    return true;
  }

  return false;
};

module.exports = {
  name: "alts",
  description: "Saves or updates your alts record.",
  syntax: `${config.PREFIX}alts`,
  async execute(message, args) {
    if (isArrayEmpty(args)) {
      message.channel.send("Seems I can't find your alts, did you put it in?");
      return;
    }
    await m.Alts.sync();
    const userId = message.author.id;
    const playerAltRecord = await m.Alts.findOrCreate({
      where: {
        playerId: userId,
      },
      defaults: {
        playerId: userId,
        alts: args.join(" "),
      },
    });
    console.log(playerAltRecord);
  },
};
