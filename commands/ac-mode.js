const {
  readJson,
  writeJson,
  hasPoAccessRole,
  checkChannelIfBuffChannel,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "ac-mode",
  description: "AC Lord Commander Buff Mode",
  syntax: `${config.PREFIX1}ac-mode`,
  po: true,
  async execute(message) {
    // Check if command is used on correct channel
    if (!checkChannelIfBuffChannel(message)) return;

    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    const r = await readJson("/data/buff-mode.json");
    if (r.success) {
      if (!r.result["buff-mode"]) {
        r.result["buff-mode"] = true;

        const isFileUpdated = await writeJson("/data/buff-mode.json", r.result);
        if (isFileUpdated) {
          message.channel.send(
            `Alliance Conquest Buff Mode is ON! Regular titles are disabled! Get them LC buff!`
          );
        }
      }
    }
  },
};
