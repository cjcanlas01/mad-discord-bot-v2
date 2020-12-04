const {
  hasPoAccessRole,
  removeNameInQueue,
  checkChannelIfBuffChannel,
  getAccountNameFromCommandRequest,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "remove",
  description: "Remove user from the title queue",
  syntax: `${config.PREFIX}remove [discord user tag] or ${config.PREFIX}remove [username]`,
  po: true,
  execute(message) {
    if (!checkChannelIfBuffChannel(message)) return;

    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    removeNameInQueue(message, getAccountNameFromCommandRequest(message));
  },
};
