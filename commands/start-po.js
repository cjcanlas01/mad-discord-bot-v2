const { addRowData, prepTrackData } = require('../common/trackingSystem');

module.exports = {
	name: 'start-po',
	description: 'Tracker mechanism when command "start-po" is called.',
	execute(message) {
		
		// Check if user has proper role for access
		if(!message.member.roles.cache.find(role => role.name === "poaccess")) {
			message.channel.send(`${message.author.toString()}, you do not have access for Protocol Officer!`);
			return false;
		}

		const data = prepTrackData(message, 'START');
		if(Object.keys(data).length > 2) {
			addRowData(data);
			message.channel.send('NOW! A new protocole officer is here to give buffs. Thank you for your time generous PO !');
			message.channel.send('https://static.wixstatic.com/media/3bd738_680cb14b338044b69d4ebfa7f451010e~mv2.jpg/v1/fill/w_569,h_427,al_c,q_80/madopen_copy.webp');
		} else {
			message.channel.send('There is a Protocol officer in session!');
		}
	}
};