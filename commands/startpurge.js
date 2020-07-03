const config = require("../common/getConfig")();

module.exports = {
  name: "startpurge",
  description: `Show Start Purge banner.`,
  syntax: `${config.PREFIX1}startpurge`,
  includes: true,
  execute(message) {
    // Get bank role
    message.channel.send("@everyone", {
      files: ["./images/startpurge.png"],
    });
  },
};
