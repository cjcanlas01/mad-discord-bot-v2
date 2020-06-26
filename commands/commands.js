/**
 * Displays all commands of discord MAD bot
 */
const commands = require('../common/getSillyMessages');

module.exports = {
	name: 'commands',
	description: 'Shows list of commands.',
	syntax: '!commands',
	includes: true,
	execute(message) {
          const keys = Array.from(commands().keys());
		message.author.send("**Current existing commands! Try them and be entertained!**");
		message.author.send("**HOW? Use !<command>**");
		message.author.send(keys);
	}
};