const config = require("../common/getConfig")();

module.exports = {
  name: "startpurge",
  description: `Show Start Purge banner.`,
  syntax: `${config.PREFIX}startpurge`,
  banners: true,
  execute(message) {
    message.channel.send("@everyone", {
      files: ["./images/startpurge.png"],
    });
  },
};
