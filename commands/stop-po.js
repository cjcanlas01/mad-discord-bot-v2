const {
  addLogRecord,
  prepareLoggedData,
  addOrRemoveRoleFromUser,
  getUserWithPoRole,
} = require("../common/trackingSystem");
const {
  hasPoAccessRole,
  writeJson,
  displayQueue,
  getAvailableAccountName,
  checkChannelIfBuffChannel,
} = require("../common/utilities");
const { messageForUserThatHasNoPoAccess } = require("../common/messages");
const config = require("../common/getConfig")();
const settings = require("../settings.json");

module.exports = {
  name: "stop-po",
  description: "Stop your PO session.",
  syntax: `${config.PREFIX}stop-po`,
  po: true,
  async execute(message) {
    // Check if command is used on correct channel
    if (!checkChannelIfBuffChannel(message)) return;

    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    const po = getUserWithPoRole(message);
    const author = getAvailableAccountName(message);

    if (po) {
      const nickname = po[0].nickname;
      if (nickname != author) {
        message.channel.send(
          "There is a Protocol officer in session, if he/ she may seem inactive, execute !replace-po to get the role. Thank you !"
        );
      } else {
        const log = prepareLoggedData(message, "STOP");
        addLogRecord(log);
        addOrRemoveRoleFromUser(message.author.id, false, message);
        message.channel.send(
          "The Protocole officer is leaving, the buffs will not be available until another one take the role. Thank you !"
        );
        message.channel.send(
          "https://static.wixstatic.com/media/3bd738_28c4b141811146a9b8d86c05d224b079~mv2.jpg/v1/fill/w_569,h_427,al_c,q_80/madclosed_copy.webp"
        );

        const queue = [
          {
            name: "Chief Builder",
            value: "[EMPTY]",
            inline: true,
          },
          {
            name: "Grand Maester",
            value: "[EMPTY]",
            inline: true,
          },
          {
            name: "Master of Ships",
            value: "[EMPTY]",
            inline: true,
          },
          {
            name: "Master of Whisperers",
            value: "[EMPTY]",
            inline: true,
          },
          {
            name: "Lord Commander",
            value: "[EMPTY]",
            inline: true,
          },
        ];

        const isFileUpdated = await writeJson("/data/queue.json", queue);
        if (isFileUpdated) {
          displayQueue(message);
        }
      }
    } else {
      message.channel.send("There is no Protocol officer currently active!");
    }
  },
};
