const config = require("../common/getConfig")();

module.exports = bootstrapCommands = (client, message) => {
  const prefix = config.PREFIX;

  if (message.content.startsWith(prefix) && !message.author.bot) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    // Find if command exists
    const isCommandExists = client.commands.has(command);
    // Find if command is misc type
    if (isCommandExists) {
      client.commands.get(command).execute(message, args);
      return;
    }
  }
};
