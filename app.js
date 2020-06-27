const fs = require('fs');
const Discord = require('discord.js');
const config = require('./common/getConfig')();
const settings = require('./settings.json');
const client = new Discord.Client();
const { commandHandler } = require('./common/trackingSystem');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity(`${ config.PREFIX1 } help`, { type: 'LISTENING' });
});

if (config.INTRODUCTION_CHANNEL) {
	client.on('guildMemberAdd', (member) => {
		const channel = member.guild.channels.cache.find(ch => ch.name === config.INTRODUCTION_CHANNEL);
		channel.send(`Hey ${member.toString()}, welcome to K40 Discord :tada::hugging: ! Please change your name to the character in game with your Alliance tag in front. Example : [ABC] JohnDoe`);
	});	
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
	const PREFIX1 = config.PREFIX1;

	// For commands that starts with tag i.e. @Role
	if (message.content.startsWith('<') && !message.author.bot) {
		/**
		* Get role details
		* @param id 
		* @returns role obj
		*/
		const getRoleDetails = (id) => {
			return message.guild.roles.cache.find((data) => {
				return data.id == id;
			});
		}

		// Parse tag to get only the id
		const parseIdTag = (tag) => {
			if (!tag) {
				return false;
			}

			const numberPattern = /\d+/g;
			return tag.match(numberPattern).join('');
		}

		const msgContent = message.content.split(" ");
		const protocolOfficer = getRoleDetails(
			parseIdTag(msgContent[0])
		);

		// Check if Protocol Officer is used as first tag
		if (protocolOfficer && protocolOfficer.name != settings.PO_ROLE) {
			return false;
		}

		let role = (function () {
			let index = msgContent.findIndex((elem) => {
				return !elem.startsWith("<");
			});

			if (index == -1) {
				return parseIdTag(msgContent[msgContent.length - 1]);
			}

			return parseIdTag(msgContent[index - 1]);
		})();

		role = getRoleDetails(role);
		let roleLowerCased;

		if (role) {
			roleLowerCased = role.name.toLowerCase();
		}

		if (role && msgContent.length >= 2) {
			// Commands using roles, has @ identifier
			const titleCommands = [
				'research',
				'gather',
				'training',
				'building',
				'atk',
			];

			if (titleCommands.includes(roleLowerCased)) {
				client.commands.get(roleLowerCased).execute(message);
				return true;
			} else {
				message.channel.send('Command not found!');
				return;
			}
		}
	}

	// For commands that starts with prefix
	if(message.content.startsWith(PREFIX1)) {
		commandHandler(client, message, PREFIX1);
		return;
	}

});

client.login(config.TOKEN);