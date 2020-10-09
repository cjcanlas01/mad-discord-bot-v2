const config = require("../common/getConfig")();
const { getRoleObj } = require("../common/trackingSystem");

module.exports = {
  name: "d-rallies2",
  description: `Show Dragon Rally banner for SRh.`,
  syntax: `${config.PREFIX1}d-rallies2`,
  banners: true,
  execute(message) {
    message.channel.send("@here Dragon rally in SRh", {
      files: ["./images/rally-dragon.jpg"],
    });
  },
};
