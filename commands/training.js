const { poSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "training",
  description: `Command for requesting __training buff__ (**${
    titleConstants().MASTER_OF_WHISPERERS
  }**).`,
  syntax:
    "@Protocol Offcer @Training or @Protocol Officer @Training <Discord User Tag>",
  includes: true,
  execute(message) {
    const BUFF_TITLE = titleConstants().MASTER_OF_WHISPERERS;
    poSystem(message, BUFF_TITLE);
  },
};
