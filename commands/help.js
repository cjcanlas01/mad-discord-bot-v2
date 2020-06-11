/**
 * Displays all commands of discord MAD bot
 */
const embed = require('../common/discordEmbed');

module.exports = {
	name: 'help',
	description: 'Show available commands of MAD bot.',
	syntax: '$mad help',
	includes: true,
	execute(message) {

		const { commands } = message.client;
		const json = commands.filter(val => {
			if(val['includes']) {
				return val;
			}
		}).map(val => {
			return {
				name: val.syntax,
				value: val.description
			}
		})

		message.author.send(embed(json));
	}
};