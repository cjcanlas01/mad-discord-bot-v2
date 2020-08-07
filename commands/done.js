const { removeNameInQueue, getUser } = require("../common/utilities");
const config = require("../common/getConfig")();
const settings = require("../settings.json");

module.exports = {
  name: "done",
  description: "Command to use when finish consuming title buff.",
  syntax: `${config.PREFIX1}done or ${config.PREFIX1}done <Username>`,
  po: true,
  execute(message) {
    // Check for the channel access
    if (message.channel.name != settings.BUFF_CHANNEL) {
      return false;
    }

    removeNameInQueue(message, getUser(message));
  },
};
