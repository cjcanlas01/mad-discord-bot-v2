const config = require("../common/getConfig")();

module.exports = {
  name: "endpurge",
  description: `Show End Purge banner.`,
  syntax: `${config.PREFIX1}endpurge`,
  includes: true,
  execute(message) {
    // Get bank role
    message.channel.send("@everyone", {
      files: ["./images/endpurge.png"],
    });
  },
};
