const { findServerRoleByName, getConfig } = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "r-rallies",
  description: `Show Rebel Camp Rally banner.`,
  syntax: `${config.PREFIX}r-rallies`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(
      message,
      getConfig(message, "CAMP_RALLIES")
    );
    message.channel.send(role.toString(), {
      files: ["./images/rally-rebel.jpg"],
    });
  },
};
