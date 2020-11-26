const {
  addRowData,
  prepTrackData,
  addOrRemoveRole,
  getCurrentPO,
} = require("../common/trackingSystem");
const { hasPoAccess, writeJson, displayQueue } = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();
const settings = require("../settings.json");

module.exports = {
  name: "stop-po",
  description: "Stop your PO session.",
  syntax: `${config.PREFIX1}stop-po`,
  po: true,
  execute(message) {
    // Check for the channel access
    if (message.channel.name != settings.BUFF_CHANNEL) {
      return false;
    }

    // Check if user has proper role for access
    if (!hasPoAccess(message)) {
      msgPoHasNoAccess(message);
      return false;
    }

    const po = getCurrentPO(message);
    const author = message.guild.member(message.author).nickname;

    if (po) {
      const poNickname = po[0].nickname;
      if (poNickname != author) {
        message.channel.send(
          "There is a Protocol officer in session, if he/ she may seem inactive, execute !replace-po to get the role. Thank you !"
        );
        return;
      }

      if (poNickname == author) {
        const data = prepTrackData(message, "STOP");
        addRowData(data);
        const discordId = message.author.id;
        addOrRemoveRole(discordId, false, message);

        message.channel.send(
          "The Protocole officer is leaving, the buffs will not be available until another one take the role. Thank you !"
        );
        message.channel.send(
          "https://cdn.discordapp.com/attachments/689325404280193094/781511106409267220/Sorry-We-Are-Closed-Yard-Sign.jpg"
        );

        // Clean queue
        const queueObj = [
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

        writeJson("/data/queue.json", queueObj)
          .then((data) => {
            displayQueue(message);
          })
          .catch((err) => {
            throw new Error(err);
          });
        return;
      }
    } else {
      message.channel.send("There is no Protocol officer currently active!");
    }
  },
};
