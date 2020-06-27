const { addRowData, prepTrackData, addOrRemoveRole, getCurrentPO } = require('../common/trackingSystem');
const { hasPoAccess } = require('../common/utilities');
const { msgPoHasNoAccess } = require('../common/messages');
const config = require('../common/getConfig')();

module.exports = {
	name: 'start-po',
	description: 'Start your PO session.',
	syntax: `${config.PREFIX1}start-po`,
	includes: true,
	execute(message) {
		
		// Check if user has proper role for access
		if (!hasPoAccess(message)) {
			msgPoHasNoAccess(message);
			return false;
		}

		const po = getCurrentPO(message);
		
		if(po) {
			message.channel.send('There is a Protocol officer in session!');
		} else {
			const data = prepTrackData(message, 'START');
			addRowData(data);
			const discordId = message.author.id;
			addOrRemoveRole(discordId, true, message);

			message.channel.send('NOW! A new protocole officer is here to give buffs. Thank you for your time generous PO !');
			message.channel.send('https://static.wixstatic.com/media/3bd738_680cb14b338044b69d4ebfa7f451010e~mv2.jpg/v1/fill/w_569,h_427,al_c,q_80/madopen_copy.webp');
		}
	}
};