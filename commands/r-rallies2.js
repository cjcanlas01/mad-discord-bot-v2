const { findServerRoleByName, getConfig } = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "r-rallies2",
  description: `Show Rebel Camp Rally banner.`,
  syntax: `${config.PREFIX}r-rallies2`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(
      message,
      getConfig(message, "SISTER_ALLIANCE_ROLE")
    );

    if (role) {
      message.channel.send(role.toString(), {
        files: ["./images/rally-rebel.jpg"],
      });
    }
  },
};
