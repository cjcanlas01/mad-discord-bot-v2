/**
 * Displays list of requested titles queue
 */
const { removeNameInQueue, hasPoAccess } = require('../common/utilities');
const { msgPoHasNoAccess } = require('../common/messages');
const config = require('../common/getConfig')();

module.exports = {
	name: 'remove',
	description: 'Remove user from the title queue.',
	syntax: `${config.PREFIX2}remove <Discord User Tag> or ${config.PREFIX2}remove <Username>`,
	includes: true,
	execute(message, args) {
		
		// Check if user has proper role for access
		if (!hasPoAccess(message)) {
			msgPoHasNoAccess(message);
			   return false;
		}

		let user;
		if (args.length > 0) {
			// For getting tagged user as argument
			if (args[0].startsWith("<")) {		
				const numberPattern = /\d+/g;
				let id = args[0].match(numberPattern).join('');
				user = message.guild.members.cache.find((data) => {
					return data.id == id;
				});
				user = user.nickname;
			} else {
				// For getting string name as argument
				user = args.join(" ");
			}
		} else {
			message.channel.send('Please use proper command syntax. Thank you.');
			return false;
		}

		removeNameInQueue(message, user);
		
	}
};