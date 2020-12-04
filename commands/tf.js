const config = require("../common/getConfig")();

module.exports = {
  name: "tf",
  description: `Show Training Fair banner.`,
  syntax: `${config.PREFIX}tf`,
  banners: true,
  execute(message) {
    message.channel.send("@everyone", {
      files: ["./images/tf.jpeg"],
    });
  },
};
