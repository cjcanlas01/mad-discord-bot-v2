const {
  addLogRecord,
  prepareLoggedData,
  getUserWithPoRole,
  addOrRemoveRoleFromUser,
} = require("../common/trackingSystem");
const {
  hasPoAccessRole,
  getAvailableAccountName,
  checkChannelIfBuffChannel,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "replace-po",
  description: "Replace current Protocol officer in case he/ she becomes afk.",
  syntax: `${config.PREFIX}replace-po`,
  po: true,
  execute(message) {
    // Check if command is used on correct channel
    if (!checkChannelIfBuffChannel(message)) return;

    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    const po = getUserWithPoRole(message)[0];
    const author = getAvailableAccountName(message);
    console.log(po);

    if (po) {
      const nickname = po.nickname;
      const id = po.id;

      if (nickname == author) {
        message.channel.send("You shall not pass! Use !stop-po instead.");
        return;
      }

      if (nickname != author) {
        message.guild.member(message.author).nickname = nickname;
        const currentUserRecord = prepareLoggedData(message, "STOP");
        if (currentUserRecord) {
          addLogRecord(currentUserRecord);
          addOrRemoveRoleFromUser(id, false, message);
        }
        message.guild.member(message.author).nickname = author;
        const upcomingUserRecord = prepareLoggedData(message, "START");
        if (upcomingUserRecord) {
          /**
           * Delay adding record
           * to follow log flow
           */
          setTimeout(function () {
            addLogRecord(upcomingUserRecord);
            addOrRemoveRoleFromUser(message.author.id, true, message);
          }, 1000);
        }
        message.channel.send(
          `NOW! The Protocol officer has been replaced. New Protocol officer is ${message.author.toString()}.`
        );
        return;
      }
      message.channel.send("There is a Protocol officer in session!");
      return;
    } else {
      message.channel.send("There is no Protocol officer currently active!");
    }
  },
};
