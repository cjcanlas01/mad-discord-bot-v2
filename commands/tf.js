const config = require("../common/getConfig")();

module.exports = {
  name: "tf",
  description: `Show Training Fair banner.`,
  syntax: `${config.PREFIX1}tf`,
  banners: true,
  execute(message) {
    // Get bank role
    message.channel.send("@everyone", {
      files: ["./images/tf.jpeg"],
    });
  },
};
