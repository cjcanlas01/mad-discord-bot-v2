const { isArrayEmpty } = require("../common/utilities");
const config = require("../common/getConfig")();
const m = require("../models/index");

module.exports = {
  name: "unbubbled",
  description: "Tags player that owns alt unbubbled.",
  syntax: `${config.PREFIX}unbubbled [alts name]`,
  async execute(message, args) {
    if (isArrayEmpty(args)) {
      message.channel.send("Seems I can't find your alts, did you put it in?");
      return;
    }

    let players = await m.Alts.findAll();
    // Get all records from model instances
    players = players.map((p) => p.dataValues);
    /**
     * Remove command from
     * message and get arguments only
     */
    let content = message.content.split(" ");
    content.shift();
    content = content.join(" ");

    /**
     * Loop through player records of alts
     * find if passed alt as argument exists
     * on any player record, if it does
     * get player discord object then
     * send message to discord
     */
    for (player of players) {
      // Transform every array element to lower case
      player.alts = player.alts.split(",").map((a) => a.toLowerCase());
      // Check if unbubbled alt exists on any player records
      if (player.alts.find((a) => a == content.toLowerCase())) {
        const getPlayer = message.guild.members.cache.find(
          (m) => m.id == player.playerId
        );
        message.channel.send(
          `Hey ${getPlayer.toString()}, ${content} is unbubbled!`
        );
        return;
      }
    }
  },
};
