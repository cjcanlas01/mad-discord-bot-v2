const {
  queueingSystem,
  titleConstants,
  findServerRoleByName,
} = require("../common/utilities");
const { getSettings } = require("../config/settings");
const settings = getSettings();

module.exports = {
  name: "atk",
  description: `Command for requesting __Lord Commander buff__ (**${
    titleConstants().LORD_COMMANDER
  }**).`,
  syntax: "@Protocol Officer @ATK or @Protocol Officer @ATK [username]",
  po: true,
  execute(message) {
    // Check if user has proper role
    if (!findServerRoleByName(message, settings.RALLY_LEADER_ROLE)) {
      message.react("❌");
      return false;
    }

    queueingSystem(message, titleConstants().LORD_COMMANDER);
  },
};
