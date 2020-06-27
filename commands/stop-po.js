const { addRowData, prepTrackData, addOrRemoveRole, getCurrentPO } = require('../common/trackingSystem');
const { hasPoAccess } = require('../common/utilities');
const { msgPoHasNoAccess } = require('../common/messages');
const config = require('../common/getConfig')();

module.exports = {
	name: 'stop-po',
	description: 'Stop your PO session.',
	syntax: `${config.PREFIX2}stop-po`,
	includes: true,
	execute(message) {

		// Check if user has proper role for access
		if (!hasPoAccess(message)) {
			msgPoHasNoAccess(message);
			return false;
		}

		const po = getCurrentPO(message);
		const author = message.guild.member(message.author).nickname;

		if(po) {
			const poNickname = po[0].nickname;
			if(poNickname != author) {
				message.channel.send('There is a Protocol officer in session, if he/ she may seem inactive, execute !replace-po to get the role. Thank you !');
				return;
			} 
			
			if(poNickname == author) {
				const data = prepTrackData(message, 'STOP');
				addRowData(data);
				const discordId = message.author.id;
				addOrRemoveRole(discordId, false, message);

				message.channel.send('The Protocole officer is leaving, the buffs will not be available until another one take the role. Thank you !');
				message.channel.send('https://static.wixstatic.com/media/3bd738_28c4b141811146a9b8d86c05d224b079~mv2.jpg/v1/fill/w_569,h_427,al_c,q_80/madclosed_copy.webp');
				return;
			}
		} else {
			message.channel.send('There is no Protocol officer currently active!');
		}
	}
};