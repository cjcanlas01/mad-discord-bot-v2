const { poSystem, titleConstants } = require("../common/utilities");

module.exports = {
  name: "building",
  description: `Command for requesting __building buff__ (**${
    titleConstants().CHIEF_BUILDER
  }**).`,
  syntax:
    "@Protocol Officer @Building or @Protocol Officer @Building <Username>",
  po: true,
  execute(message) {
    const BUFF_TITLE = titleConstants().CHIEF_BUILDER;
    poSystem(message, BUFF_TITLE);
  },
};
