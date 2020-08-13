const config = require("../common/getConfig")();
const { getRoleObj } = require("../common/trackingSystem");

module.exports = {
  name: "d-rallies2",
  description: `Show Dragon Rally banner.`,
  syntax: `${config.PREFIX1}d-rallies2`,
  banners: true,
  execute(message) {
    const littleMADRole = getRoleObj("MaD Member", message);
    if (littleMADRole) {
      message.channel.send(littleMADRole.toString(), {
        files: ["./images/rally-dragon.jpg"],
      });
    }
  },
};
