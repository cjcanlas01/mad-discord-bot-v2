const { readJson, writeJson } = require('../common/utilities');

module.exports = {
	name: 'ac-stop',
	description: 'AC Lord Commander Buff MODE',
	syntax: '!AC-stop',
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
                 * If buff mode condition is true, make it false
                 */
                if(data['buff-mode']) {
                    // Update buff-mode value to false
                    data['buff-mode'] = false;
                    writeJson('/data/buff-mode.json', data)
                        .then(data => {
                            if(data) {
                                console.log(data)
                                message.channel.send(`Alliance Conquest Buff Mode OFF! Regular titles are enabled! Get them!`);
                            }
                        })
                        .catch(err => {
                            throw new Error(err);
                        })
                }
           })
           .catch(error => console.log(error))
	}
};