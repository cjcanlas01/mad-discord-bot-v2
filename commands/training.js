const { queueingSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "training",
  description: `Command for requesting __training buff__ (**${
    titleConstants().MASTER_OF_WHISPERERS
  }**).`,
  syntax:
    "@Protocol Offcer @Training or @Protocol Officer @Training [username]",
  po: true,
  isRoleCommand: true,
  execute(message) {
    queueingSystem(message, titleConstants().MASTER_OF_WHISPERERS);
  },
};
