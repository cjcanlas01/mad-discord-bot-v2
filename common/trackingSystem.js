/**
 * Function to read commands only available with prefix "!"
 *
 * @param client | discord object
 * @param message | discord object
 * @param prefix | string
 * @return null
 */
const commandHandler = (client, message, prefix) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return false;
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  // List of available commands to prefix "!"
  const acceptableCommands = [
    "srhhelp",
    "r-rallies",
    "r-rallies2",
    "d-rallies",
    "d-rallies2",
    "startpurge",
    "endpurge",
    "hive",
    "ty1",
    "ty2",
    "ty3",
    "banners",
  ];

  if (!client.commands.has(command) || !acceptableCommands.includes(command))
    return;

  try {
    client.commands.get(command).execute(message, args);
    return true;
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
};

module.exports = {
  commandHandler,
};
