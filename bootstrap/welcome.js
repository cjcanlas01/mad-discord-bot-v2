const { getSettings } = require("../config/settings");
const { findChannelByName } = require("../common/utilities");
const settings = getSettings();

module.exports = bootstrapWelcome = (client) => {
  client.on("guildMemberAdd", (member) => {
    /**
     * Welcome message container for servers, based on given identification tag (look in config/settings.js for server tags)
     */
    const welcomeMsg = {
      MAD: function (name, rulesChannel = null) {
        return `Hey ${name.toString()}, welcome to MAD Discord :tada::hugging: ! Please change your name to the character in game with your Alliance tag in front. Example : [ABC] JohnDoe \n\nIf you're here to apply to MAD, please copy and paste the following message: \n\`!iam Applicant\``;
      },
      K65: function (name, rulesChannel = null) {
        return `Hey ${name.toString()}, welcome to K65 Discord :tada::hugging: ! Please change your name to the character in game with your Alliance tag in front. Example : [ABC] JohnDoe`;
      },
    };

    const channelDetail = settings.WELCOME_CHANNEL[member.guild.name];
    const welcomeChannel = findChannelByName(
      member,
      channelDetail.welcomeChannel
    );

    welcomeChannel.send(welcomeMsg[channelDetail.tag](member.toString()));
  });
};
