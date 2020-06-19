const { readJson, writeJson } = require('../common/utilities');

module.exports = {
	name: 'ac-mode',
	description: 'AC Lord Commander Buff MODE',
	syntax: '!AC-mode',
	includes: true,
    execute(message) {
        
        // Check if user has proper role for access
		if(!message.member.roles.cache.find(role => role.name === "poaccess")) {
			message.channel.send(`${message.author.toString()}, you do not have access for Protocol Officer!`);
			return false;
		}

        readJson('/data/buff-mode.json')
           .then(data => {
                /**
                 * If buff mode condition is false, make it true
                 */
                if(!data['buff-mode']) {
                    // Update buff-mode value to true
                    data['buff-mode'] = true;
                    writeJson('/data/buff-mode.json', data)
                        .then(data => {
                            if(data) {
                                console.log(data)
                                message.channel.send(`Alliance Conquest Buff Mode ON! Regular titles are disabled! Get them LC buff!`);
                            }
                        })
                        .catch(err => {
                            throw new Error(err);
                        })
                } else {
                    message.channel.send(`Alliance Conquest Buff Mode already active!`);
                }
           })
           .catch(error => console.log(error))
	}
};