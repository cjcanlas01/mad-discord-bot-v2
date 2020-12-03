const { queueingSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "training",
  description: `Command for requesting __training buff__ (**${
    titleConstants().MASTER_OF_WHISPERERS
  }**).`,
  syntax:
    "@Protocol Offcer @Training or @Protocol Officer @Training <Username>",
  po: true,
  execute(message) {
    const BUFF_TITLE = titleConstants().MASTER_OF_WHISPERERS;
    queueingSystem(message, BUFF_TITLE);
  },
};
