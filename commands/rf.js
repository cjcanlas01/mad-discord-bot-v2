const config = require("../common/getConfig")();

module.exports = {
  name: "rf",
  description: `Show Research Fair banner.`,
  syntax: `${config.PREFIX}rf`,
  banners: true,
  execute(message) {
    message.channel.send("@everyone", {
      files: ["./images/rf.png"],
    });
  },
};
