const fs = require("fs");
const Discord = require("discord.js");
const config = require("./common/getConfig")();
const client = new Discord.Client();
const bootstrapWelcome = require("./bootstrap/welcome");
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
client.configs = new Discord.Collection();
client.banks = new Discord.Collection();
client.welcomeMsgs = new Discord.Collection();

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

client.once("ready", async () => {
  console.log("Ready!");
  client.user.setActivity(`${config.PREFIX}madhelp`, { type: "LISTENING" });
  setConfigVariables();
  bootstrapWelcome(client);
  // setInterval(() => {
  //   bootstrapBubble(client);
  // }, 60000);
});

client.on("message", (message) => {
  bootstrapCommand(client, message);
});

client.login(config.TOKEN);

const setConfigVariables = async () => {
  const m = require("./models/index");
  const getConfigList = await m.Config.findAll({
    attributes: ["config", "value"],
  });
  const getBankConfig = await m.Bank.findAll({
    attributes: ["name", "transport_tax", "transport_amount"],
  });
  const getMsgList = await m.WelcomeMessage.findAll({
    attributes: ["guild", "channel", "message"],
  });

  const configList = getConfigList.map((c) => c.dataValues);
  const bankList = getBankConfig.map((c) => c.dataValues);
  const msgList = getMsgList.map((c) => c.dataValues);
  for (const config of configList) {
    client.configs.set(config.config, config.value);
  }

  for (const bank of bankList) {
    client.banks.set(bank.name, {
      TRANSPORT_TAX: bank.transport_tax,
      TRANSPORT_AMOUNT: bank.transport_amount,
    });
  }

  for (const msg of msgList) {
    client.welcomeMsgs.set(msg.guild, {
      WELCOME_CHANNEL: msg.channel,
      MESSAGE: msg.message,
    });
  }
};
