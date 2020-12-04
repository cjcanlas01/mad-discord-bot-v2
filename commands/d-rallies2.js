const { findServerRoleByName } = require("../common/utilities");
const config = require("../common/getConfig")();
const { getSettings } = require("../config/settings");
const settings = getSettings();

module.exports = {
  name: "d-rallies2",
  description: `Show Dragon Rally banner.`,
  syntax: `${config.PREFIX}d-rallies2`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(message, settings.SISTER_ALLIANCE_ROLE);

    if (role) {
      message.channel.send(role.toString(), {
        files: ["./images/rally-dragon.jpg"],
      });
    }
  },
};
