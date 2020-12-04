const {
  addLogRecord,
  prepareLoggedData,
  addOrRemoveRoleFromUser,
} = require("../common/trackingSystem");
const {
  hasPoAccessRole,
  getUserWithPoRole,
  checkChannelIfBuffChannel,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "start-po",
  description: "Start your PO session.",
  syntax: `${config.PREFIX}start-po`,
  po: true,
  execute(message) {
    // Check if command is used on correct channel
    if (!checkChannelIfBuffChannel(message)) return;

    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    const po = getUserWithPoRole(message);

    if (po) {
      message.channel.send("There is a Protocol officer in session!");
    } else {
      const log = prepareLoggedData(message, "START");
      addLogRecord(log);
      addOrRemoveRoleFromUser(message.author.id, true, message);
      message.channel.send(
        "NOW! A new protocole officer is here to give buffs. Thank you for your time generous PO !"
      );
      message.channel.send(
        "https://static.wixstatic.com/media/3bd738_680cb14b338044b69d4ebfa7f451010e~mv2.jpg/v1/fill/w_569,h_427,al_c,q_80/madopen_copy.webp"
      );
    }
  },
};
