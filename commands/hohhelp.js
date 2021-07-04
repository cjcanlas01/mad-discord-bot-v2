/**
 * Displays all commands of discord MAD bot
 */
 const embed = require("../common/discordEmbed");
 const config = require("../common/getConfig")();
 
 module.exports = {
   name: "hohhelp",
   description: "Show available commands of HOH bot.",
   syntax: `${config.PREFIX}hohhelp`,
   includes: true,
   execute(message) {
     const { commands } = message.client;
     const json = commands
       .filter((val) => {
         if (val["includes"]) {
           return val;
         }
       })
       .map((val) => {
         return {
           name: val.syntax,
           value: val.description,
         };
       });
 
     message.author.send(
       embed(
         json,
         null,
         null
       )
     );
   },
 };