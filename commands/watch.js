const { isArrayEmpty, post } = require("../common/utilities");
const config = require("../common/getConfig")();
const m = require("../models/index");

const getWatchList = async (message) => {
  return m.Alts.findAll({
    attributes: ['alts'],
    where: {
      playerId: message.author.id,
    }
  });
}

const printWatchList = async (message) => {
  const watchData = await getWatchList(message);
  const list = (!isArrayEmpty(watchData)) ? watchData[0].dataValues.alts : null;
  return (list)
    ? `${message.author.toString()}, your current watch list is: ${list}`
    : `Seems I can't find your watch list, have you added any characters yet?`;
}

const updateOrInsert = async (message, args) => {
  const [, isCreated] = await m.Alts.upsert(
    {
      playerId: message.author.id,
      alts: args.join(" "),
    },
    {
      returning: true,
    }
  );
  const createdText = (isCreated) ? 'added' : 'updated';
  return `${message.author.toString()}, your watch record has been ${createdText}.`;
}

module.exports = {
  name: "watch",
  description: "Saves or updates your watch record.",
  syntax: `${config.PREFIX}watch [name separated by comma]`,
  includes: true,
  getWatchList,
  printWatchList,
  updateOrInsert,
  async execute(message, args) {
    /**
     * If args list is empty, return watch list or a message that
     * they don't have anyone on their watch list yet.
     *
     * If arg list is not empty and record is not found, create record, else update record.
     */
    const sendMessage = (isArrayEmpty(args)) ? await printWatchList(message) : await updateOrInsert(message, args);
    return post(message, sendMessage);
  },
};
