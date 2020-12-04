const {
  hasPoAccessRole,
  displayQueue,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "queue",
  description: "Update list of requested titles in queue channel",
  syntax: `${config.PREFIX}queue`,
  po: true,
  execute(message) {
    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    displayQueue(message);
  },
};
