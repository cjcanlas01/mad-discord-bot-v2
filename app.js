const fs = require("fs");
const Discord = require("discord.js");
const config = require("./common/getConfig")();
const client = new Discord.Client();
const { commandHandler } = require("./common/trackingSystem");

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity(`${config.PREFIX1}srhhelp`, { type: "LISTENING" });
});

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", (message) => {
  const PREFIX1 = config.PREFIX1;

  // For commands that starts with prefix
  if (message.content.startsWith(PREFIX1)) {
    commandHandler(client, message, PREFIX1);
    return;
  }
});

client.login(config.TOKEN);
