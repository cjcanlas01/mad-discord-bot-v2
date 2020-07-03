const config = require("../common/getConfig")();

module.exports = {
  name: "bf",
  description: `Show Building Fair banner.`,
  syntax: `${config.PREFIX1}bf`,
  includes: true,
  execute(message) {
    // Get bank role
    message.channel.send("@everyone", {
      files: ["./images/bf.jpeg"],
    });
  },
};
