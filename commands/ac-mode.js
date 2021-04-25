const {
  hasPoAccessRole,
  checkChannelIfBuffChannel,
  messageForUserThatHasNoPoAccess,
  getBuffMode,
  setBuffMode,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "ac-mode",
  description: "AC Lord Commander Buff Mode",
  syntax: `${config.PREFIX}ac-mode`,
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

    if (buffMode)
      return message.channel.send("Alliance Conquest Buff Mode is ACTIVE!");

    const isUpdated = await setBuffMode("true");
    if (isUpdated.length > 0) {
      message.channel.send(
        `Alliance Conquest Buff Mode is ON! Regular titles are disabled! Get them LC buff!`
      );
    }
  },
};
