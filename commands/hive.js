const config = require("../common/getConfig")();

module.exports = {
  name: "hive",
  description: `Show Hive Under Attack banner.`,
  syntax: `${config.PREFIX}hive`,
  banners: true,
  execute(message) {
    // Get bank role
    message.channel.send("@everyone", {
      files: ["./images/hive.png"],
    });
  },
};
