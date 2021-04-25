const { findServerRoleByName, getConfig } = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "rtj-tp",
  description: `Show Run The Jewels Transport banner.`,
  syntax: `${config.PREFIX}rtj-tp`,
  banners: true,
  execute(message) {
    const role = findServerRoleByName(message, getConfig(message, "BANK_ROLE"));

    if (role) {
      message.channel.send(role.toString(), {
        files: ["./images/rtj-tp.jpg"],
      });
    }
  },
};
