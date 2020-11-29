/**
 * Displays list of requested titles queue
 */
const {
  removeNameInQueue,
  hasPoAccessRole,
  getUser,
} = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();
const settings = require("../settings.json");

module.exports = {
  name: "remove",
  description: "Remove user from the title queue.",
  syntax: `${config.PREFIX1}remove <Discord User Tag> or ${config.PREFIX1}remove <Username>`,
  po: true,
  execute(message, args) {
    // Check for the channel access
    if (message.channel.name != settings.BUFF_CHANNEL) {
      return false;
    }

    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      msgPoHasNoAccess(message);
      return false;
    }

    removeNameInQueue(message, getUser(message));
  },
};
