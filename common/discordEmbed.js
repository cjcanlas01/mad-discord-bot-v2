/**
 * Common function to return discord embed
 *
 * @param {fields} object for populating fields of discord embed
 */
const Discord = require("discord.js");

module.exports = discordEmbed = (fields, title = null, footer = null) => {
  const setTitle = title ? title : "FaeBot";
  const setFooter = footer
    ? footer
    : "FAE! FAE! FAE! FAE! FAE! FAE! FAE! FAE! FAE! FAE! FAE! FAE! FAE! FAE!";
  return new Discord.MessageEmbed()
    .setTitle(setTitle)
    .setColor(0xff0000)
    .addFields(fields)
    .setFooter(setFooter);
};
