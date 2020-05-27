/**
 * Displays all commands of discord MAD bot
 */
const embed = require('../common/discordEmbed');

module.exports = {
	name: 'help',
	description: 'Show available commands of MAD bot.',
	syntax: '$mad help',
	execute(message) {

		const { commands } = message.client;
		const json = commands.map(val => {
			return {
				name: val.syntax,
				value: val.description
			}
		})

		message.author.send(embed(json));
	}
};