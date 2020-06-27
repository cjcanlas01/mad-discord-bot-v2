/**
 * Displays list of requested titles queue
 */
const embed = require('../common/discordEmbed');
const { readJson, hasPoAccess } = require('../common/utilities');
const { msgPoHasNoAccess } = require('../common/messages');
const config = require('../common/getConfig')();

module.exports = {
	name: 'queue',
	description: 'Show list of requested titles in queue.',
	syntax: `${config.PREFIX1}queue`,
	includes: true,
	execute(message) {

		// Check if user has proper role for access
		if (!hasPoAccess(message)) {
			msgPoHasNoAccess(message);
			   return false;
		}

	   	const title = '**K40 Title Queue**';
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