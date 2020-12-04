const config = require("../common/getConfig")();

module.exports = {
  name: "ty3",
  description: `Show Tyrion Elite banner for 2x - 864k.`,
  syntax: `${config.PREFIX}ty3`,
  banners: true,
  execute(message) {
    message.channel.send("@here \n 2x Tyrion \n Research / Building - 864k", {
      files: ["./images/ty.png"],
    });
  },
};
