const { addRowData, prepTrackData, checkTrackSession, getTrackSession } = require('../common/trackingSystem');

module.exports = {
	name: 'replace-po',
	description: 'Handler when current Protocol officer is afk.',
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
			const dataForStop = prepTrackData(message, 'STOP', true);
			if(dataForStop) {
				addRowData(dataForStop);
			}
			
			message.guild.member(message.author).nickname = COMMAND_EXECUTOR;
			const dataForStart =  prepTrackData(message, 'START');
			if(dataForStart) {
				setTimeout(function() {
					addRowData(dataForStart);
				}, 1000);
			}

			message.channel.send(`NOW! The Protocol officer has been replaced. Current officer is ${message.author.toString()}.`);
		} else {
			message.channel.send('You shall not pass! Use !stop-po instead.');
		}
	}
};