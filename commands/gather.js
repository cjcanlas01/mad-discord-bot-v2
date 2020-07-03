const { poSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "gather",
  description: `Command for requesting __gathering buff__ (**${
    titleConstants().MASTER_OF_SHIPS
  }**).`,
  syntax:
    "@Protocol Officer @Gather or @Protocol Officer @Gather <Discord User Tag>",
  includes: true,
  execute(message) {
    const BUFF_TITLE = titleConstants().MASTER_OF_SHIPS;
    poSystem(message, BUFF_TITLE);
  },
};
