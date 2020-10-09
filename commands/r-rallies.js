const config = require("../common/getConfig")();

module.exports = {
  name: "r-rallies",
  description: `Show Rebel Camp Rally banner for SRH.`,
  syntax: `${config.PREFIX1}r-rallies`,
  banners: true,
  execute(message) {
    message.channel.send("@here Rebel camp in SRH", {
      files: ["./images/rally-rebel.jpg"],
    });
  },
};
