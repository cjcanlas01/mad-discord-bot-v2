const config = require("../common/getConfig")();

module.exports = {
  name: "ty",
  description: `Show Tyrion banner.`,
  syntax: `${config.PREFIX1}ty`,
  includes: true,
  execute(message) {
    // Get bank role
    message.channel.send("@everyone", {
      files: ["./images/ty.png"],
    });
  },
};
