const config = require("../common/getConfig")();

module.exports = {
  name: "d-rallies",
  description: `Show Dragon Rally banner for SRH.`,
  syntax: `${config.PREFIX1}d-rallies`,
  banners: true,
  execute(message) {
    message.channel.send("@here Dragon rally in SRH", {
      files: ["./images/rally-dragon.jpg"],
    });
  },
};
