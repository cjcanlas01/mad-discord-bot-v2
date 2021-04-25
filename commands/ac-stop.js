const {
  getBuffMode,
  setBuffMode,
  hasPoAccessRole,
  checkChannelIfBuffChannel,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "ac-stop",
  description: "AC Lord Commander Buff Mode",
  syntax: `${config.PREFIX}ac-stop`,
  po: true,
  async execute(message) {
    // Check if command is used on correct channel
    if (!checkChannelIfBuffChannel(message)) return;

    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    let buffMode = await getBuffMode();
    buffMode = JSON.parse(buffMode);

    if (!buffMode)
      return message.channel.send("Alliance Conquest Buff Mode is INACTIVE!");

    const isUpdated = await setBuffMode("false");
    if (isUpdated.length > 0) {
      message.channel.send(
        `Alliance Conquest Buff Mode is OFF! Regular titles are enabled! Get them!`
      );
    }
  },
};
