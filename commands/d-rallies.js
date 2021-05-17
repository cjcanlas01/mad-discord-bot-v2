const { findServerRoleByName, getConfig } = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "d-rallies",
  description: `Show Dragon Rally banner.`,
  syntax: `${config.PREFIX}d-rallies`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(
      message,
      getConfig(message, "DRAGON_RALLIES")
    );
    message.channel.send(role.toString(), {
      files: ["./images/rally-dragon.jpg"],
    });
  },
};
