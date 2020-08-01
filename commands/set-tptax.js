/**
 */
const config = require("../common/getConfig")();
const { readJson, writeJson } = require("../common/utilities");

module.exports = {
  name: "set-tptax",
  description: "Set bank transport tax",
  syntax: `${config.PREFIX1}setp-tpamt <Bank Transport Tax>`,
  execute(message) {
    const taxArgument = message.content.split(" ")[1];

    if (!taxArgument) {
      message.channel.send("Bank transport tax is missing! Please try again.");
      return false;
    }

    const fileName = "./settings.json";
    readJson(fileName).then((data) => {
      // Set transport amount
      data.MAX_TRANSPORT_AMOUNT = taxArgument;
      writeJson(fileName, data).then((data) => {
        if (data == "File update success!") {
          message.channel.send("Bank transport tax updated! Thank you.");
          return false;
        }
      });
    });
  },
};
