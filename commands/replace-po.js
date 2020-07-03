const {
  addRowData,
  prepTrackData,
  getCurrentPO,
  addOrRemoveRole,
} = require("../common/trackingSystem");
const { hasPoAccess } = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();

module.exports = {
  name: "replace-po",
  description: "Replace current Protocol officer in case he/ she becomes afk.",
  syntax: `${config.PREFIX1}replace-po`,
  po: true,
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

    const po = getCurrentPO(message);
    const author = message.guild.member(message.author).nickname;

    if (po) {
      const poNickname = po[0].nickname;
      const poID = po[0].id;

      if (poNickname == author) {
        message.channel.send("You shall not pass! Use !stop-po instead.");
        return;
      }

      if (poNickname != author) {
        message.guild.member(message.author).nickname = poNickname;
        const dataForStop = prepTrackData(message, "STOP");
        if (dataForStop) {
          addRowData(dataForStop);
          addOrRemoveRole(poID, false, message);
        }

        message.guild.member(message.author).nickname = author;
        const dataForStart = prepTrackData(message, "START");
        if (dataForStart) {
          setTimeout(function () {
            addRowData(dataForStart);
            addOrRemoveRole(message.author.id, true, message);
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
