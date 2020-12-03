const {
  readJson,
  writeJson,
  hasPoAccessRole,
  checkChannelIfBuffChannel,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "ac-stop",
  description: "AC Lord Commander Buff Mode",
  syntax: `${config.PREFIX1}ac-stop`,
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
      if (r.result["buff-mode"]) {
        // Update buff mode to false
        r.result["buff-mode"] = false;

        const isFileUpdated = await writeJson("/data/buff-mode.json", r.result);
        if (isFileUpdated) {
          message.channel.send(
            `Alliance Conquest Buff Mode is OFF! Regular titles are enabled! Get them!`
          );
        }
      }
    }
  },
};
