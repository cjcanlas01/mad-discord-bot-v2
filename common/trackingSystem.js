const { SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = require('../config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

/**
 * Function to read commands only available with prefix "!"
 * 
 * @param client | discord object
 * @param message | discord object
 * @param prefix | string
 * @return null
 */
const commandHandler = (client, message, prefix) => {

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    // List of available commands to prefix "!"
    const acceptableCommands = [
        'start-po',
        'stop-po'
    ];
    
    if (!client.commands.has(command) || !acceptableCommands.includes(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
}

/**
 * Function to prepare tracking data to add to sheet row using google sheets api
 * 
 * @param message | discord object
 * @param event | string
 * @return object
 */
const prepTrackData = (message, event) => {
    const guildData = message.guild.member(message.author);
    const date = new Date(message.createdAt);
    const length = String(guildData.nickname).split(/\[(.*?)\]/).length;

    const nickname = guildData.nickname != null ? guildData.nickname  : message.author.username;
    const alliance = length > 1 ? String(guildData.nickname).split(/\[(.*?)\]/)[1] : null;
    const name = length <= 1 ? nickname : String(nickname).split(/\[(.*?)\]/)[2];

    const dateFormat = date.getUTCFullYear()  + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
    const timeFormat = (function() {
        const UTCHour = date.getUTCHours();
        const UTCMin = date.getUTCMinutes();
        // If minutes is whole number (0 to 9), add another zero
        if(UTCMin >= 0 && UTCMin <= 9) {
            return UTCHour + ":" + "0" + UTCMin;
        }

        return UTCHour + ":" + UTCMin;
    })();

    return {
        ALLIANCE: alliance,
        NAME: name,
        ACTION: event,
        DATE: dateFormat,
        TIME: timeFormat  
    };
}

/**
 * Function to add tracking data to row sheet using google sheet api
 * 
 * @param rowData | object
 * @return null
 */
const addRowData = (rowData) => {
    (async function(){
        // await doc.useServiceAccountAuth(require('./client_secret.json'));
        await doc.useServiceAccountAuth({
            client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
        await sheet.addRow(rowData);
    })(rowData);
}

/**
 * TODO: 
 * 
 * Function to set tracking current protocol officer session
 */
const setTrackSession = () => {

}

/**
 * TODO:
 * 
 * Function to check current protocol officer session
 */
const checkTrackSession = () => {
    
}

module.exports = {
    commandHandler,
    prepTrackData,
    addRowData
};