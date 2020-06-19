const fs = require('fs');
const Discord = require('discord.js');
const getConfig = require('./common/getConfig');
const config = getConfig();
const client = new Discord.Client();
const { commandHandler } = require('./common/trackingSystem');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity(`${ config.PREFIX1 } help`, { type: 'LISTENING' });
});

client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.cache.find(ch => ch.name === config.INTRODUCTION_CHANNEL);
	channel.send(`Hey @${member.toString()}, welcome to K40 Discord :tada::hugging: ! Please change your name to the character in game with your Alliance tag in front. Example : [ABC] JohnDoe`);
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
	const PREFIX1 = config.PREFIX1;
	const PREFIX2 = config.PREFIX2;

	if(message.content.startsWith(PREFIX2) || message.content.startsWith('<')) {
		commandHandler(client, message, PREFIX2);
		return;
	}

	if (!message.content.startsWith(PREFIX1) || message.author.bot) return;
	const acceptableCommands = [
        'calc',
        'help'
    ];
	
	const args = message.content.slice(PREFIX1.length);
	const command = args.trim().split(" ")[0];

	if (!client.commands.has(command) || !acceptableCommands.includes(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(config.TOKEN);