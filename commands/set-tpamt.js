/**
 */
const config = require("../common/getConfig")();
const { readJson, writeJson } = require("../common/utilities");

module.exports = {
  name: "set-tpamt",
  description: "Set bank transport amount",
  syntax: `${config.PREFIX1}setp-tpamt <Bank Transport Amount>`,
  execute(message) {
    const transportArgument = message.content.split(" ")[1];

    if (!transportArgument) {
      message.channel.send(
        "Bank transport amount is missing! Please try again."
      );
      return false;
    }

    const fileName = "./settings.json";
    readJson(fileName).then((data) => {
      // Set transport amount
      data.MAX_TRANSPORT_AMOUNT = transportArgument;
      writeJson(fileName, data).then((data) => {
        if (data == "File update success!") {
          message.channel.send("Bank transport amount updated! Thank you.");
          return false;
        }
      });
    });
  },
};
