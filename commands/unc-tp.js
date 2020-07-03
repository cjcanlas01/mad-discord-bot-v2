const config = require("../common/getConfig")();
const settings = require("../settings.json");
const { getRoleObj } = require("../common/trackingSystem");

module.exports = {
  name: "unc-tp",
  description: `Show Unicorn Express Tranport banner.`,
  syntax: `${config.PREFIX1}unc-tp`,
  includes: true,
  execute(message) {
    // Get bank role
    const bank = getRoleObj(settings.BANK_ROLE, message);
    message.channel.send(bank.toString(), {
      files: ["./images/unc-tp.png"],
    });
  },
};
