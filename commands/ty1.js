const config = require("../common/getConfig")();

module.exports = {
  name: "ty1",
  description: `Show Tyrion Elite banner for 1x - 187k.`,
  syntax: `${config.PREFIX1}ty1`,
  banners: true,
  execute(message) {
    // Get bank role
    message.channel.send("@here \n 1x Tyrion \n Training / Building - 187k", {
      files: ["./images/ty.png"],
    });
  },
};
