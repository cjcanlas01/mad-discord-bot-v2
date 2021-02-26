const { queueingSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "atk",
  description: `Command for requesting __Lord Commander buff__ (**${
    titleConstants().LORD_COMMANDER
  }**).`,
  syntax: "@Protocol Officer @ATK or @Protocol Officer @ATK [username]",
  po: true,
  isRoleCommand: true,
  execute(message) {
    queueingSystem(message, titleConstants().LORD_COMMANDER);
  },
};
