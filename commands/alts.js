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
    const [data, exists] = await m.Alts.select(
        {
          playerId: message.author.id,
        },
        {
          returning: true,
        }
    );
    // const [, isCreated] = await m.Alts.upsert(
    //   {
    //     playerId: message.author.id,
    //     alts: args.join(" "),
    //   },
    //   {
    //     returning: true,
    //   }
    // );
  
    console.log(exists);
    console.log(data);
  
    // if (!isCreated && isArrayEmpty(args)) {
    //   message.channel.send("Seems I can't find your alts, did you put it in?");
    //   return;
    // }

    // if (isCreated) {
    //   message.channel.send(
    //     `${message.author.toString()}, your alt record has been added.`
    //   );
    // } else if (isCreated && isArrayEmpty(args)) {
    //   /**
    //    * Show them their current !alts list
    //    */
    //   message.channel.send(
    //       `${message.author.toString()}, your current alt record is: ${data.dataValues.alts}`
    //   );
    // } else {
    //   message.channel.send(
    //     `${message.author.toString()}, your alt record has been updated.`
    //   );
    // }
  },
};
