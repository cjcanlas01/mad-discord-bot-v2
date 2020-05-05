const embed = require('../common/discordEmbed');
const getArgs = require('../common/getArgs');
const account = require('../modules/accounting.min');

module.exports = {
	name: 'calc',
	description: 'Compute for bank requirement.',
	execute(message, args) {
		const [ shipped, delivered, requested ] = getArgs('calc', args);
		const percentMultiplicator = 5;
		
		let totalBalance = Number(shipped) * percentMultiplicator;
    	let availableBalance = totalBalance - Number(delivered);
		let requestResult = (requested <= availableBalance) ? ':thumbsup:' : ':thumbsdown:';
		let output;

		if(shipped && delivered && requested) {
			output = [
				{ name: 'Total balance', value: account.formatNumber(totalBalance), inline: true },
				{ name: 'Available balance', value: account.formatNumber(availableBalance), inline: true },
				{ name: 'Requested', value: requestResult }
			];
		} else {
			output = [
				{ name: 'ALERT', value: 'Please input required values!' }
			];
		}
		
		message.channel.send(embed(
			output	
        ));
	},
};