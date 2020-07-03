const { poSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "atk",
  description: `Command for requesting __lord commander buff__ (**${
    titleConstants().LORD_COMMANDER
  }**).`,
  syntax: "@Protocol Officer @ATK or @Protocol Officer @ATK <Username>",
  po: true,
  execute(message) {
    const BUFF_TITLE = titleConstants().LORD_COMMANDER;
    poSystem(message, BUFF_TITLE);
  },
};
