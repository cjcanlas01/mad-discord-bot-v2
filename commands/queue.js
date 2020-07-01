/**
 * Displays list of requested titles queue
 */
const { hasPoAccess, displayQueue } = require('../common/utilities');
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

		displayQueue(message);

	}
};