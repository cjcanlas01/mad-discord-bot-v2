const fs = require("fs");
const Discord = require("discord.js");
const config = require("./common/getConfig")();
const client = new Discord.Client();
const { commandHandler } = require("./common/utils");

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity(`${config.PREFIX}help`, { type: "LISTENING" });
});

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", (message) => {
  const PREFIX = config.PREFIX;

  // For commands that starts with prefix
  if (message.content.startsWith(PREFIX)) {
    commandHandler(client, message, PREFIX);
    return;
  }
});

client.login(config.TOKEN);
