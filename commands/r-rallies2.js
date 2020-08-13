const config = require("../common/getConfig")();
const { getRoleObj } = require("../common/trackingSystem");

module.exports = {
  name: "r-rallies2",
  description: `Show Rebel Camp Rally banner.`,
  syntax: `${config.PREFIX1}r-rallies2`,
  banners: true,
  execute(message) {
    const littleMADRole = getRoleObj("MaD Member", message);
    if (littleMADRole) {
      message.channel.send(littleMADRole.toString(), {
        files: ["./images/rally-rebel.jpg"],
      });
    }
  },
};
