const { queueingSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "building",
  description: `Command for requesting __Building buff__ (**${
    titleConstants().CHIEF_BUILDER
  }**).`,
  syntax:
    "@Protocol Officer @Building or @Protocol Officer @Building [username]",
  po: true,
  isRoleCommand: true,
  execute(message) {
    queueingSystem(message, titleConstants().CHIEF_BUILDER);
  },
};
