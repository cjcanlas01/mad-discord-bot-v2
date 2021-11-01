const { isArrayEmpty } = require("../common/utilities");
const config = require("../common/getConfig")();
const m = require("../models/index");
const { Op } = require("sequelize");

module.exports = {
  name: "unbubbled",
  description: "Tags player that owns alt unbubbled.",
  syntax: `${config.PREFIX}unbubbled [alts name]`,
  includes: true,
  async execute(message, args) {
    try {
      if (isArrayEmpty(args)) {
        message.channel.send(
          "Seems I can't find your alts, did you put it in?"
        );
        return;
      }
      /**
       * Remove command from
       * message and get arguments only
       */
      let content = message.content.split(" ");
      content.shift();
      const castleToWatch = content.join(" ");

      // Get all records from model instance
      const players = await m.Alts.findAll({
        where: {
          alts: {
            [Op.like]: `%${castleToWatch}%`,
          },
        },
      });
      const watchList = players.map((p) => {
        const { playerId } = { ...p.dataValues };
        return `<@${playerId}>`;
      });

      const watchMessage =
        watchList.length >= 1
          ? `Hey ${watchList.join(" ")}, ${castleToWatch} is unbubbled!`
          : `Protectors not found!`;
      message.channel.send(watchMessage);
    } catch (err) {
      console.log(err);
    }
  },
};
