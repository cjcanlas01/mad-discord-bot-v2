const { writeJson, displayQueue } = require('../common/utilities');

module.exports = {
	name: 'reset-queue',
	description: 'Reset title queue.',
	syntax: '!reset-queue',
	includes: true,
     execute(message) {

          // Check if user has proper role for access
		if(!message.member.roles.cache.find(role => role.name === "poaccess")) {
			message.channel.send(`${message.author.toString()}, you do not have access for Protocol Officer!`);
			return false;
		}
          
          const queueObj = [
               {
                    "name": "Chief Builder",
                    "value": "[EMPTY]",
                    "inline": true
               },
               {
                    "name": "Grand Maester",
                    "value": "[EMPTY]",
                    "inline": true
               },
               {
                    "name": "Master of Ships",
                    "value": "[EMPTY]",
                    "inline": true
               },
               {
                    "name": "Master of Whisperers",
                    "value": "[EMPTY]",
                    "inline": true
               },
               {
                    "name": "Lord Commander",
                    "value": "[EMPTY]",
                    "inline": true
               }
          ];
          
          writeJson('/data/queue.json', queueObj)
          .then((data) => {
               message.channel.send("Title queue is empty now.");
               displayQueue(message);
          })
          .catch((err) => {
              throw new Error(err);
          });
	}
};