/**
 * Displays all commands of discord MAD bot
 */
const embed = require('../common/discordEmbed');

module.exports = {
	name: 'help',
	description: 'Show available commands of MAD bot.',
	execute(message) {
		message.channel.send(embed(
			{ name: 'Compute for bank requirement', value: '$mad calc <shipped> <delivered> <requested>' }
		));
	}
};