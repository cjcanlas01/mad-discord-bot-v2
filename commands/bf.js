const config = require("../common/getConfig")();

module.exports = {
  name: "bf",
  description: `Show Building Fair banner.`,
  syntax: `${config.PREFIX}bf`,
  banners: true,
  execute(message) {
    message.channel.send("@everyone", {
      files: ["./images/bf.jpeg"],
    });
  },
};
