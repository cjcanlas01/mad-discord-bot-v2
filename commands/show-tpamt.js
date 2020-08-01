/**
 */
const config = require("../common/getConfig")();
const { readJson, writeJson } = require("../common/utilities");

module.exports = {
  name: "show-tpamt",
  description: "Show bank transport amount",
  syntax: `${config.PREFIX1}show-tpamt`,
  execute(message) {
    const fileName = "./settings.json";
    readJson(fileName).then((data) => {
      // Show transport amount
      message.channel.send(
        `Bank transport amount: ${data.MAX_TRANSPORT_AMOUNT}`
      );
    });
  },
};
