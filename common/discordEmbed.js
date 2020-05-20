/**
 * Common function to return discord embed
 * 
 * @param {fields} object for populating fields of discord embed
 */
const Discord = require('discord.js');

module.exports = discordEmbed = (fields) => {
    return new Discord.MessageEmbed()
        .setTitle('MAD is here! How can I help?')
        .setColor(0xff0000)
        .addFields(
            fields
        );
};