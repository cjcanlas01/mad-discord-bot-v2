const { addRowData, prepTrackData } = require('../common/trackingSystem');

module.exports = {
	name: 'stop-po',
	description: 'Tracker mechanism when command "stop-po" is called.',
	execute(message, args) {
		message.channel.send('TEST: PO STOPPED.');
		// TODO
		addRowData(
			prepTrackData(message, 'STOP')
		);
	},
};