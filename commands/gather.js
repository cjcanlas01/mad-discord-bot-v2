const { queueingSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "gather",
  description: `Command for requesting __gathering buff__ (**${
    titleConstants().MASTER_OF_SHIPS
  }**).`,
  syntax: "@Protocol Officer @Gather or @Protocol Officer @Gather [username]",
  po: true,
  isRoleCommand: true,
  execute(message) {
    queueingSystem(message, titleConstants().MASTER_OF_SHIPS);
  },
};
