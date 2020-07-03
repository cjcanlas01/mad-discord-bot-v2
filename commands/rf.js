const config = require("../common/getConfig")();

module.exports = {
  name: "rf",
  description: `Show Research Fair banner.`,
  syntax: `${config.PREFIX1}rf`,
  banners: true,
  execute(message) {
    // Get bank role
    message.channel.send("@everyone", {
      files: ["./images/rf.png"],
    });
  },
};
