const embed = require('../common/discordEmbed');

module.exports = {
	name: 'help',
	description: 'Show available commands of MAD bot.',
	execute(message, args) {
          message.channel.send(embed(
            { name: 'Compute for bank requirement', value: '$mad calc <shipped> <delivered> <requested>' }
          ));
	},
};