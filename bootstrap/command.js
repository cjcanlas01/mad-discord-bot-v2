const config = require("../common/getConfig")();
const { getSettings } = require("../config/settings");
const settings = getSettings();
const { checkChannelIfBuffChannel } = require("../common/utilities");

/**
 * Find role by id
 * @param id
 * @returns discord role
 */
const findRoleById = (message, id) => {
  return message.guild.roles.cache.find((r) => r.id == id);
};

/**
 * Parse id number from role string
 * check if regex returns a value
 */
const parseIdFromRoleTag = (role) => {
  const regex = role.match(/\d+/g);
  if (regex) {
    return regex.join("");
  }

  return false;
};

module.exports = bootstrapCommands = (client, message) => {
  const prefix = config.PREFIX;

  if (message.content.startsWith(prefix) && !message.author.bot) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const miscCommands = require("../common/getSillyMessages")();
    // Find if command exists
    const isCommandExists = client.commands.has(command);
    // Find if command is misc type
    const isMiscCommands = miscCommands.has(command);
    if (isCommandExists) {
      client.commands.get(command).execute(message, args);
      return;
    }

    if (isMiscCommands) {
      message.channel.send(miscCommands.get(command));
      return;
    }
  }

  if (message.content.startsWith("<") && !message.author.bot) {
    const content = message.content.split(" ");
    const [poRole, commandRole] = content;
    // Check if command is used on correct channel
    if (!checkChannelIfBuffChannel(message)) return;

    const protocolOfficerRole = findRoleById(
      message,
      parseIdFromRoleTag(poRole)
    );

    // Check first if command starts with Protocol Officer role tag
    if (protocolOfficerRole && protocolOfficerRole.name != settings.PO_ROLE)
      return;
    // Now check for role command as second argument and if value parsed is correct
    if (!commandRole || !parseIdFromRoleTag(commandRole)) return;

    let commandTag = findRoleById(message, parseIdFromRoleTag(commandRole));
    commandTag = commandTag.name.toLowerCase();
    // Initialize collection of role commands
    const roleCollection = client.roleCommands;
    // Check if role command exists
    const isCommandExists = roleCollection.has(commandTag);
    if (isCommandExists) {
      roleCollection.get(commandTag).execute(message);
    }
  }
};
