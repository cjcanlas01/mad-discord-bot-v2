const {
  addRowData,
  prepTrackData,
  addOrRemoveRole,
  getCurrentPO,
} = require("../common/trackingSystem");
const { hasPoAccess } = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();
const settings = require("../settings.json");

module.exports = {
  name: "start-po",
  description: "Start your PO session.",
  syntax: `${config.PREFIX1}start-po`,
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

    if (po) {
      message.channel.send("There is a Protocol officer in session!");
    } else {
      const data = prepTrackData(message, "START");
      addRowData(data);
      const discordId = message.author.id;
      addOrRemoveRole(discordId, true, message);

      message.channel.send(
        "NOW! A new protocole officer is here to give buffs. Thank you for your time generous PO !"
      );
      message.channel.send(
        "https://cdn.discordapp.com/attachments/689325404280193094/781511105011777536/Come-In-We-Are-Open-GW-Yard-Sign.jpg"
      );
    }
  },
};
