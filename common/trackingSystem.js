const { SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = require('../config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
const session = require('sessionstorage');
const CURRENT_PO = 'CURRENT_PO';
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
        'stop-po',
        'replace-po'
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
 * Get alliance tag of player name on discord server
 * @param nickname | Discord Nickname
 */
const getAllianceTag = (nickname) => {
    const tag = nickname.slice(0, 5);
    const tagWithoutBrackets = tag.substr(1, tag.length-2);
    return tagWithoutBrackets;
}

/**
 * Get player name of user on discord server
 * @param nickname | Discord Nickname
 */
const getPlayerName = (nickname) => {
    nickname = Array.from(nickname);
    let lastTag;
    for(let i = nickname.length; i >=0; i--) {
        if(nickname[i] == "]") {
            lastTag = i;
        }
    }

    const playerName = nickname.slice((lastTag + 1), nickname.length);
    const sanitizedPlayerName = (() => {
        // Remove space on first index if found, due to alliance tag removed
        if(playerName[0] == " ") {
            playerName.shift();
        }

        // For players that has two names
        const slashIndex = Array.from(playerName).findIndex(val => val == '/');
        if(slashIndex != -1) {
            return playerName.slice(0, slashIndex - 1).join('');
        }

        return playerName.join('');

    })();
    return sanitizedPlayerName;
}

/**
 * Function to prepare tracking data to add to sheet row using google sheets api
 * 
 * @param message | discord object
 * @param event | string
 * @return object
 */
const prepTrackData = (message, event, commit = false) => {
    const guildData = message.guild.member(message.author);
    const date = new Date(message.createdAt);
    const nickname = guildData.nickname != null ? guildData.nickname  : message.author.username;

    // Check if a PO is in session
    if(checkTrackSession() && commit == false) {
        return {
            PO: session.getItem(CURRENT_PO),
            STATUS: false
        };
    }

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

    // For starting po, set PO for current session
    if(event == 'START') {
        setTrackSession(nickname);
    } else {
        session.clear();
    }

    return {
        ALLIANCE: getAllianceTag(nickname),
        NAME: getPlayerName(nickname),
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
 * Function to set tracking current protocol officer session
 */
const setTrackSession = (nickname) => {
    if(!checkTrackSession()) {
        session.setItem(CURRENT_PO, nickname);
    }
}

/**
 * Function to check current protocol officer session
 */
const checkTrackSession = () => {
    if(session.getItem(CURRENT_PO)) {
        return true;
    }

    return false;
}

const getTrackSession = () => {
    return session.getItem(CURRENT_PO);
}

module.exports = {
    commandHandler,
    prepTrackData,
    addRowData,
    getPlayerName,
    getTrackSession,
    checkTrackSession
};