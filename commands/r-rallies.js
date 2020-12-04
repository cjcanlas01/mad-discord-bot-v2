const config = require("../common/getConfig")();

module.exports = {
  name: "r-rallies",
  description: `Show Rebel Camp Rally banner.`,
  syntax: `${config.PREFIX}r-rallies`,
  banners: true,
  execute(message) {
    message.channel.send("@here", {
      files: ["./images/rally-rebel.jpg"],
    });
  },
};
