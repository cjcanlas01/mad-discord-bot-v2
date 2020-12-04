const config = require("../common/getConfig")();

module.exports = {
  name: "d-rallies",
  description: `Show Dragon Rally banner.`,
  syntax: `${config.PREFIX}d-rallies`,
  banners: true,
  execute(message) {
    message.channel.send("@here", {
      files: ["./images/rally-dragon.jpg"],
    });
  },
};
