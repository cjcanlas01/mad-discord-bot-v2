const config = require("../common/getConfig")();

module.exports = {
  name: "ty3",
  description: `Show Tyrion elite banner.`,
  syntax: `${config.PREFIX1}ty3`,
  includes: true,
  execute(message) {
    // Get bank role
    message.channel.send("@here \n 2x Tyrion \n Research / Building - 864k", {
      files: ["./images/ty.png"],
    });
  },
};
