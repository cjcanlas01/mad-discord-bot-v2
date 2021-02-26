const { isArrayEmpty } = require("../common/utilities");
const config = require("../common/getConfig")();
const m = require("../models/index");

module.exports = {
  name: "alts",
  description: "Saves or updates your alts record.",
  syntax: `${config.PREFIX}alts [alts name separated by comma]`,
  async execute(message, args) {
    /**
     * If record is not found, create record
     * else update record
     */
    const data = await m.Alts.findAll({
      attributes: ['alts'],
        where: {
          playerId: message.author.id,
        }
    });

    const alts = (!isArrayEmpty(data)) ? data[0].dataValues.alts : false;

    if (!!alts && isArrayEmpty(args)) {
      return message.channel.send(`${message.author.toString()}, your current alt record is: ${alts}`);
    }

    const [, isCreated] = await m.Alts.upsert(
      {
        playerId: message.author.id,
        alts: args.join(" "),
      },
      {
        returning: true,
      }
    );

    if (!alts && !isCreated && isArrayEmpty(args)) {
      return message.channel.send("Seems I can't find your alts, did you put it in?");
    }

    if (isCreated) {
      message.channel.send(
        `${message.author.toString()}, your alt record has been added.`
      );
    } else {
      message.channel.send(
        `${message.author.toString()}, your alt record has been updated.`
      );
    }
  },
};
