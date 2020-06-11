const { 
	addRowData, 
	prepTrackData, 
	checkTrackSession, 
	getTrackSession, 
	addOrRemoveRole } = require('../common/trackingSystem');
const session = require('sessionstorage');

module.exports = {
	name: 'replace-po',
	description: 'Replace current Protocol officer in case he/ she becomes afk.',
	syntax: '!replace-po',
	includes: true,
	execute(message) {
		
		// Check if user has proper role for access
		if(!message.member.roles.cache.find(role => role.name === "poaccess")) {
			message.channel.send(`${message.author.toString()}, you do not have access for Protocol Officer!`);
			return false;
		}
		
		// Check if there is no PO in session
		if(!checkTrackSession()) {
			message.channel.send('There is no Protocol officer in session!');
			return false;
		}
		
		const COMMAND_EXECUTOR = message.guild.member(message.author).nickname;
		const currentPO = getTrackSession();

		if(COMMAND_EXECUTOR != currentPO) {

			message.guild.member(message.author).nickname = currentPO;
			const currentPO_ID = session.getItem('CURRENT_PO_ID');
			const dataForStop = prepTrackData(message, 'STOP', true);
			if(dataForStop) {
				addRowData(dataForStop);
				addOrRemoveRole(currentPO_ID, false, message);
			}
			
			message.guild.member(message.author).nickname = COMMAND_EXECUTOR;
			const dataForStart =  prepTrackData(message, 'START');
			if(dataForStart) {
				setTimeout(function() {
					addRowData(dataForStart);
					addOrRemoveRole(message.author.id, true, message);
				}, 1000);
			}

			message.channel.send(`@here \n NOW! The Protocol officer has been replaced. New Protocol officer is ${message.author.toString()}.`);
		} else {
			message.channel.send('You shall not pass! Use !stop-po instead.');
		}
	}
};