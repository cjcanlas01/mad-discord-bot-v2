const fs = require("fs");
const Discord = require("discord.js");
const config = require("./common/getConfig")();
const client = new Discord.Client();
const bootstrapWelcome = require("./bootstrap/welcome");
const bootstrapCommand = require("./bootstrap/command");
const { bootstrapBubble } = require("./bootstrap/bubble");

/**
 * Initialize collections for
 * different command categories
 */
client.commands = new Discord.Collection();
client.roleCommands = new Discord.Collection();

// Get all command file names
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

/**
 * Separate role based commands from
 * string commands and set them to
 * their respective collections
 */
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.isRoleCommand) {
    client.roleCommands.set(command.name, command);
  } else {
    client.commands.set(command.name, command);
  }
}

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity(`${config.PREFIX}madhelp`, { type: "LISTENING" });

  bootstrapWelcome(client);
  setInterval(() => {
    bootstrapBubble(client);
  }, 60000);
});

client.on("message", (message) => {
  bootstrapCommand(client, message);
});

client.login(config.TOKEN);
