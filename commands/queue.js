/**
 * Displays list of requested titles queue
 */
const { hasPoAccessRole, displayQueue } = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();

module.exports = {
  name: "queue",
  description: "Update list of requested titles in queue.",
  syntax: `${config.PREFIX1}queue`,
  po: true,
  execute(message) {
    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      msgPoHasNoAccess(message);
      return false;
    }

    displayQueue(message);
  },
};
