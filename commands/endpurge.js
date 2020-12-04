const config = require("../common/getConfig")();

module.exports = {
  name: "endpurge",
  description: `Show End Purge banner.`,
  syntax: `${config.PREFIX}endpurge`,
  banners: true,
  execute(message) {
    message.channel.send("@everyone", {
      files: ["./images/endpurge.png"],
    });
  },
};
