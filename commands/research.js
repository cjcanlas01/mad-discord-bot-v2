const { poSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "research",
  description: `Command for requesting __research buff__ (**${
    titleConstants().GRAND_MAESTER
  }**).`,
  syntax:
    "@Protocol Offcer @Research or @Protocol Officer @Research <Username>",
  po: true,
  execute(message) {
    const BUFF_TITLE = titleConstants().GRAND_MAESTER;
    poSystem(message, BUFF_TITLE);
  },
};
