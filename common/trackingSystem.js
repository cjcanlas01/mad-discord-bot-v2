const getConfig = require("../common/getConfig");
const config = getConfig();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(config.SPREADSHEET_ID);
const settings = require("../settings.json");

/**
 * Function to read commands only available with prefix "!"
 *
 * @param client | discord object
 * @param message | discord object
 * @param prefix | string
 * @return null
 */
const commandHandler = (client, message, prefix) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return false;
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  // List of available commands to prefix "!"
  const acceptableCommands = [
    "start-po",
    "stop-po",
    "replace-po",
    "commands",
    "queue",
    "ac-mode",
    "ac-stop",
    "remove",
    "reset-queue",
    "calc",
    "madhelp",
    "done",
    "r-rallies",
    "r-rallies2",
    "d-rallies",
    "d-rallies2",
    "unc-tp",
    "rtj-tp",
    "startpurge",
    "endpurge",
    "hive",
    "rf",
    "tf",
    "bf",
    "ty1",
    "ty2",
    "ty3",
    "banners",
    "po",
    "req",
    "set-tpamt",
    "set-tptax",
    "show-tpamt",
    "show-tptax",
    "set-time-unc",
    "set-time-mad",
    "tealc",
  ];

  const sillyCommands = require("../common/getSillyMessages")();
  if (
    !client.commands.has(command) &&
    !acceptableCommands.includes(command) &&
    sillyCommands.has(command)
  ) {
    message.channel.send(sillyCommands.get(command));
    return;
  }

  if (!client.commands.has(command) || !acceptableCommands.includes(command))
    return;

  try {
    client.commands.get(command).execute(message, args);
    return true;
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
};

/**
 * Get alliance tag of player name on discord server
 * @param nickname | Discord Nickname
 */
const getAllianceTag = (nickname) => {
  const tag = nickname.slice(0, 5);
  const tagWithoutBrackets = tag.substr(1, tag.length - 2);
  return tagWithoutBrackets;
};

/**
 * Get player name of user on discord server
 * @param nickname | Discord Nickname
 */
const getPlayerName = (nickname) => {
  nickname = Array.from(nickname);
  let lastTag;
  for (let i = nickname.length; i >= 0; i--) {
    if (nickname[i] == "]") {
      lastTag = i;
    }
  }

  const playerName = nickname.slice(lastTag + 1, nickname.length);
  const sanitizedPlayerName = (() => {
    // Remove space on first index if found, due to alliance tag removed
    if (playerName[0] == " ") {
      playerName.shift();
    }

    // For players that has two names
    const slashIndex = Array.from(playerName).findIndex((val) => val == "/");
    if (slashIndex != -1) {
      return playerName.slice(0, slashIndex - 1).join("");
    }

    return playerName.join("");
  })();
  return sanitizedPlayerName;
};

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
  const nickname =
    guildData.nickname != null ? guildData.nickname : message.author.username;

  const dateFormat =
    date.getUTCFullYear() +
    "-" +
    (date.getUTCMonth() + 1) +
    "-" +
    date.getUTCDate();
  const timeFormat = (function () {
    const UTCHour = date.getUTCHours();
    const UTCMin = date.getUTCMinutes();
    // If minutes is whole number (0 to 9), add another zero
    if (UTCMin >= 0 && UTCMin <= 9) {
      return UTCHour + ":" + "0" + UTCMin;
    }

    return UTCHour + ":" + UTCMin;
  })();

  return {
    ALLIANCE: getAllianceTag(nickname),
    NAME: getPlayerName(nickname),
    ACTION: event,
    DATE: dateFormat,
    TIME: timeFormat,
  };
};

/**
 * Function to add tracking data to row sheet using google sheet api
 *
 * @param rowData | object
 * @return null
 */
const addRowData = (rowData) => {
  (async function () {
    // await doc.useServiceAccountAuth(require('./client_secret.json'));
    await doc.useServiceAccountAuth({
      client_email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: config.GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    await sheet.addRow(rowData);
  })(rowData);
};

/**
 * Function to get role object
 * @param roleString | string
 * @param message | Discord Message Object
 */
const getRoleObj = (roleString, message) => {
  // Find discord role object
  let role = message.guild.roles.cache.find((data) => {
    return data.name == roleString;
  });
  return role;
};

/**
 * Function to add or remove role of Protocol officer
 * @param id | Discord ID of user
 * @param condition | boolean
 * @param message | Discord Message Object
 */
const addOrRemoveRole = (id, condition, message) => {
  message.guild.members.fetch(id).then((memberData) => {
    const role = getRoleObj(settings.PO_ROLE, message);
    if (condition) {
      memberData.roles.add(role);
    } else {
      memberData.roles.remove(role);
    }
  });
};

/**
 * Function to identify if there is current user with Protocol officer role
 *
 * @param message | Discord Message Object
 * @return false (boolean) or user data (object)
 */
const getCurrentPO = (message) => {
  // Get list of all members with Protocol officer role
  const poData = message.guild.members.cache
    .filter((member) => {
      return member.roles.cache.find((data) => {
        return data.name == settings.PO_ROLE;
      });
    })
    .map((member) => {
      return {
        nickname: member.nickname,
        id: member.id,
      };
    });

  // Get only the name of users
  const isPOSingle = Object.keys(poData).map((val) => {
    return poData[val].nickname;
  });

  // Check if there are one or more users with Protocol officer
  if (isPOSingle.length > 1) {
    message.channel.send(
      "There are currently more than one users with **Protocol Officer** role. Please check!"
    );
    return false;
  }

  // Check if there is no Protocol officer
  if (isPOSingle.length < 1) {
    return false;
  }

  return poData;
};

module.exports = {
  commandHandler,
  prepTrackData,
  addRowData,
  getPlayerName,
  getRoleObj,
  addOrRemoveRole,
  getCurrentPO,
};
