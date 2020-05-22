const { addRowData, prepTrackData } = require('../common/trackingSystem');

module.exports = {
	name: 'start-po',
	description: 'Tracker mechanism when command "start-po" is called.',
	execute(message, args) {
		message.channel.send('TEST: PO STARTED.');
		console.log('TEST: PO STARTED.');
		// TODO
		addRowData(
			prepTrackData(message, 'START')	
		);
	},
};