/**
 * Common function to return discord embed
 *
 * @param {fields} object for populating fields of discord embed
 */
const Discord = require("discord.js");

module.exports = discordEmbed = (fields, title, footer = null) => {
  const setTitle = title ? title : "MAD is here! How can I help?";
  const setFooter = footer ? footer : "What is MAD may never die!";
  return new Discord.MessageEmbed()
    .setTitle(setTitle)
    .setColor(0xff0000)
    .addFields(fields)
    .setFooter(setFooter);
};
