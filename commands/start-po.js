const { addRowData, prepTrackData, addOrRemoveRole } = require('../common/trackingSystem');

module.exports = {
	name: 'start-po',
	description: 'Start your PO session.',
	syntax: '!start-po',
	execute(message) {
		
		// Check if user has proper role for access
		if(!message.member.roles.cache.find(role => role.name === "poaccess")) {
			message.channel.send(`${message.author.toString()}, you do not have access for Protocol Officer!`);
			return false;
		}

		const data = prepTrackData(message, 'START');
		if(Object.keys(data).length > 2) {
			if(data) {
				addRowData(data);
				const discordId = message.author.id;
				addOrRemoveRole(discordId, true, message);
			}
			message.channel.send('NOW! A new protocole officer is here to give buffs. Thank you for your time generous PO !');
			message.channel.send('https://static.wixstatic.com/media/3bd738_680cb14b338044b69d4ebfa7f451010e~mv2.jpg/v1/fill/w_569,h_427,al_c,q_80/madopen_copy.webp');
		} else {
			message.channel.send('There is a Protocol officer in session!');
		}
	}
};