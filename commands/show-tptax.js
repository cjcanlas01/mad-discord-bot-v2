/**
 */
const config = require("../common/getConfig")();
const { readJson } = require("../common/utilities");

module.exports = {
  name: "show-tptax",
  description: "Show bank transport tax.",
  syntax: `${config.PREFIX1}show-tptax`,
  execute(message) {
    const fileName = "./settings.json";
    readJson(fileName).then((data) => {
      // Show transport amount
      message.channel.send(`Bank transport tax: ${data.TRANSPORT_TAX}`);
    });
  },
};
