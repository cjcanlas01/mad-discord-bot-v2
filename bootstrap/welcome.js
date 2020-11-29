const settings = require("../config/settings")();

module.exports = bootstrapWelcome = (client) => {
  /**
   * Welcome message container for servers, based on given identification tag (look in settings.json for server tags)
   */
  const welcomeMsg = {
    MAD: function (name, rulesChannel = null) {
      return `Hey ${name.toString()}, welcome to MAD Discord :tada::hugging: ! Please change your name to the character in game with your Alliance tag in front. Example : [ABC] JohnDoe`;
    },
    K31: function (name, rulesChannel = null) {
      return `Hey ${member.toString()}, welcome to K40 Discord :tada::hugging: ! Please change your name to the character in game with your Alliance tag in front. Example : [ABC] JohnDoe`;
    },
  };

  const channelDetail = settings.WELCOME_CHANNEL[member.guild.name];
  const welcomeChannel = member.guild.channels.cache.find(
    (ch) => ch.name == channelDetail.welcomeChannel
  );
  const rulesChannel = member.guild.channels.cache.find(
    (ch) => ch.name == channelDetail.rulesChannel
  );

  welcomeChannel.send(
    welcomeMsg[channelDetail.tag](member.toString(), rulesChannel)
  );
};
