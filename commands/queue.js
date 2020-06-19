/**
 * Displays list of requested titles queue
 */
const embed = require('../common/discordEmbed');
const { readJson } = require('../common/utilities');

module.exports = {
	name: 'queue',
	description: 'Show list of requested titles in queue.',
	syntax: '!queue',
	includes: true,
	execute(message) {

		// Check if user has proper role for access
		if(!message.member.roles.cache.find(role => role.name === "poaccess")) {
			message.channel.send(`${message.author.toString()}, you do not have access for Protocol Officer!`);
			return false;
		}

	   	const title = '**K40 Title Queue**';
		// const footer = 'Created and maintained by: [MAD] Q Coldwater';
	   	const footer = 'MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD!';
        	readJson('/data/queue.json')
          	.then((data) => {
          		message.channel.send(embed(data, title, footer));
          	})
            	.catch((err) => {
               	throw new Error(err);
          	});
	}
};