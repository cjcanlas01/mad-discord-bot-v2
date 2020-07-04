/**
 * Displays list of requested titles queue
 */
const {
  removeNameInQueue,
  hasPoAccess,
  getUser,
} = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();

module.exports = {
  name: "remove",
  description: "Remove user from the title queue.",
  syntax: `${config.PREFIX1}remove <Discord User Tag> or ${config.PREFIX1}remove <Username>`,
  po: true,
  execute(message, args) {
    // Check for the channel access
    if (message.channel.name != config.BUFF_CHANNEL) {
      return false;
    }

    // Check if user has proper role for access
    if (!hasPoAccess(message)) {
      msgPoHasNoAccess(message);
      return false;
    }

    removeNameInQueue(message, getUser(message));
  },
};
