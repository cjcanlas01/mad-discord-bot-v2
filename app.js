const fs = require("fs");
const Discord = require("discord.js");
const config = require("./common/getConfig")();
const client = new Discord.Client();
const bootstrapCommand = require("./bootstrap/command");
const db = require("./common/db");

/**
 * Check if db connection works
 */
(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
})();

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
  client.commands.set(command.name, command);
}

client.once("ready", async () => {
  console.log("Ready!");
  client.user.setActivity(`${config.PREFIX}madhelp`, { type: "LISTENING" });
});

client.on("message", (message) => {
  bootstrapCommand(client, message);
});

client.login(config.TOKEN);

