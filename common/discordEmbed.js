
const Discord = require('discord.js');
const client = new Discord.Client();

const discordEmbed = (fields) => {
    return new Discord.MessageEmbed()
        .setTitle('MAD is here! How can I help?')
        .setColor(0xff0000)
        .addFields(
            fields
        );
};

module.exports = discordEmbed;