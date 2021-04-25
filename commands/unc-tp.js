const { findServerRoleByName, getConfig } = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "unc-tp",
  description: `Show Unicorn Express Tranport banner.`,
  syntax: `${config.PREFIX}unc-tp`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(message, getConfig(message, "BANK_ROLE"));

    if (role) {
      message.channel.send(role.toString(), {
        files: ["./images/unc-tp.png"],
      });
    }
  },
};
