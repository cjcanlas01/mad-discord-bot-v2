const { findServerRoleByName } = require("../common/utilities");
const config = require("../common/getConfig")();
const { getSettings } = require("../config/settings");
const settings = getSettings();

module.exports = {
  name: "rtj-tp",
  description: `Show Run The Jewels Transport banner.`,
  syntax: `${config.PREFIX}rtj-tp`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(message, settings.BANK_ROLE);

    if (role) {
      message.channel.send(role.toString(), {
        files: ["./images/rtj-tp.jpg"],
      });
    }
  },
};
