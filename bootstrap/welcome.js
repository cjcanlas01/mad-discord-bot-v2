const { findChannelByName, getWelcomeMsgs } = require("../common/utilities");

function stringInject(str, arr) {
  if (typeof str !== "string" || !(arr instanceof Array)) {
    return false;
  }

  return str.replace(/({\d})/g, function (i) {
    return arr[i.replace(/{/, "").replace(/}/, "")];
  });
}

module.exports = bootstrapWelcome = (client) => {
  client.on("guildMemberAdd", (member) => {
    const guild = getWelcomeMsgs(member, member.guild.name);
    if (!guild) return false;
    const welcomeChannel = findChannelByName(member, guild.WELCOME_CHANNEL);
    const msg = stringInject(guild.MESSAGE, [member.toString()]);
    welcomeChannel.send(msg);
  });
};
