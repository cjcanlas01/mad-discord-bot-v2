const config = require("../common/getConfig")();
const { getRoleObj } = require("../common/trackingSystem");

module.exports = {
  name: "r-rallies2",
  description: `Show Rebel Camp Rally banner for SRh.`,
  syntax: `${config.PREFIX1}r-rallies2`,
  banners: true,
  execute(message) {
    message.channel.send("@here Rebel camp in SRh", {
      files: ["./images/rally-rebel.jpg"],
    });
  },
};
