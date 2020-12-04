const { findServerRoleByName } = require("../common/utilities");
const config = require("../common/getConfig")();
const { getSettings } = require("../config/settings");
const settings = getSettings();

module.exports = {
  name: "unc-tp",
  description: `Show Unicorn Express Tranport banner.`,
  syntax: `${config.PREFIX}unc-tp`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(message, settings.BANK_ROLE);

    if (role) {
      message.channel.send(role.toString(), {
        files: ["./images/unc-tp.png"],
      });
    }
  },
};
