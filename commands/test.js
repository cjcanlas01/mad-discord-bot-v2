const config = require("../common/getConfig")();
const { getCurrentPO } = require("../common/trackingSystem");

module.exports = {
  name: "test",
  description: `Show Building Fair banner.`,
  syntax: `${config.PREFIX1}test`,
  banners: true,
  execute(message) {
    // Get bank role
    // message.channel.send("@everyone", {
    //   files: ["./images/bf.jpeg"],
    // });
    getCurrentPO(message);
  },
};
