const { removeNameInQueue, getUser } = require('../common/utilities');

module.exports = {
	name: 'done',
	description: 'Command to use when finish consuming title buff.',
	syntax: '@Done or @Done <Username>',
	includes: true,
	execute(message) {

		removeNameInQueue(message, getUser(message));
		
	}
};