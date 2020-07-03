const config = require("../common/getConfig")();

module.exports = {
  name: "d-rallies",
  description: `Show dragon rally banner.`,
  syntax: `${config.PREFIX1}d-rallies`,
  includes: true,
  execute(message) {
    message.channel.send("@here", {
      files: ["./images/rally-dragon.jpg"],
    });
  },
};
