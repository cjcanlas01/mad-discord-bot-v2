const { readJson, writeJson, hasPoAccess } = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();

module.exports = {
  name: "ac-mode",
  description: "AC Lord Commander Buff MODE",
  syntax: `${config.PREFIX1}AC-mode`,
  includes: true,
  execute(message) {
    // Check for the channel access
    if (message.channel.name != config.BUFF_CHANNEL) {
      return false;
    }

    // Check if user has proper role for access
    if (!hasPoAccess(message)) {
      msgPoHasNoAccess(message);
      return false;
    }

    readJson("/data/buff-mode.json")
      .then((data) => {
        /**
         * If buff mode condition is false, make it true
         */
        if (!data["buff-mode"]) {
          // Update buff-mode value to true
          data["buff-mode"] = true;
          writeJson("/data/buff-mode.json", data)
            .then((data) => {
              if (data) {
                console.log(data);
                message.channel.send(
                  `Alliance Conquest Buff Mode ON! Regular titles are disabled! Get them LC buff!`
                );
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        } else {
          message.channel.send(`Alliance Conquest Buff Mode already active!`);
        }
      })
      .catch((error) => console.log(error));
  },
};
