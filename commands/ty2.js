const config = require("../common/getConfig")();

module.exports = {
  name: "ty2",
  description: `Show Tyrion Elite banner for 2x - 604k.`,
  syntax: `${config.PREFIX}ty2`,
  banners: true,
  execute(message) {
    message.channel.send("@here \n 2x Tyrion \n Research / Building - 604k", {
      files: ["./images/ty.png"],
    });
  },
};
