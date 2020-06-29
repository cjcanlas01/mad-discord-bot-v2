const config = require('../common/getConfig')();
const settings = require('../settings.json');
const { getRoleObj } = require('../common/trackingSystem');

module.exports = {
	name: 'rtj-tp',
	description: `Show Run The Jewels Transport banner.`,
	syntax: `${config.PREFIX1}rtj-tp`,
	includes: true,
    execute(message) {
         
        // Get bank role
        const bank = getRoleObj(settings.BANK_ROLE, message);
        message.channel.send(bank.toString(), {
            files: [
                "./images/rtj-tp.jpg"
            ]
        });
	}
};