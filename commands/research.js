const { queueingSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "research",
  description: `Command for requesting __research buff__ (**${
    titleConstants().GRAND_MAESTER
  }**).`,
  syntax:
    "@Protocol Offcer @Research or @Protocol Officer @Research [username]",
  po: true,
  isRoleCommand: true,
  execute(message) {
    queueingSystem(message, titleConstants().GRAND_MAESTER);
  },
};
