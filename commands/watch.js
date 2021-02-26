const { isArrayEmpty } = require("../common/utilities");
const config = require("../common/getConfig")();
const m = require("../models/index");

module.exports = {
  name: "watch",
  description: "Saves or updates your watch record.",
  syntax: `${config.PREFIX}watch [name separated by comma]`,
  async execute(message, args) {
    if (isArrayEmpty(args)) {
      message.channel.send(
        "Seems I can't find your watch record, did you put it in?"
      );
      return;
    }
    /**
     * If record is not found, create record
     * else update record
     */
    const [, isCreated] = await m.Alts.upsert(
      {
        playerId: message.author.id,
        alts: args.join(" "),
      },
      {
        returning: true,
      }
    );

    if (isCreated) {
      message.channel.send(
        `${message.author.toString()}, your watch record has been added.`
      );
    } else {
      message.channel.send(
        `${message.author.toString()}, your watch record has been updated.`
      );
    }
  },
};
