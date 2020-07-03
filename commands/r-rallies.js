const config = require("../common/getConfig")();

module.exports = {
  name: "r-rallies",
  description: `Show rebel camp rally banner.`,
  syntax: `${config.PREFIX1}r-rallies`,
  includes: true,
  execute(message) {
    message.channel.send("@here", {
      files: ["./images/rally-rebel.jpg"],
    });
  },
};
