const config = require("../common/getConfig")();
const {
  getAvailableAccountName,
  findServerRoleByName,
  initGoogleSpreadsheetConnection,
  getConfig,
} = require("../common/utilities");

/**
 * Get alliance tag of player name on discord server
 * @param nickname | string
 */
const getAllianceTag = (nickname) => {
  let tag = nickname.slice(0, 5);
  // Remove brackets from string
  tag = tag.substr(1, tag.length - 2);
  return tag;
};

/**
 * Clean player name to
 * get single string
 */
const sanitizePlayerName = (playerName) => {
  /**
   * If space occurs on first index,
   * remove space
   */
  if (playerName[0] == " ") {
    playerName.shift();
  }

  /**
   * Find slash to identify
   * first of two names based
   * on slash position
   */
  const findIndexOfSlash = playerName.findIndex((e) => e == "/");
  if (findIndexOfSlash != -1) {
    return playerName.slice(0, findIndexOfSlash - 1).join("");
  }

  return playerName.join("");
};

/**
 * Get player name of user on discord server
 * @param nickname | string
 * @returns string
 */
const getPlayerName = (nickname) => {
  // Convert string to array
  nickname = Array.from(nickname);
  const findWhereBracketFinishes = nickname.findIndex((e) => e == "]");

  const playerName = nickname.slice(
    findWhereBracketFinishes + 1,
    nickname.length
  );

  return sanitizePlayerName(playerName);
};

/**
 * Get proper time value
 * @param hour
 * @param min
 */
const getTime = (hour, min) => {
  if (min >= 0 && min <= 9) {
    return `${hour}:0${min}`;
  }

  return `${hour}:${min}`;
};

/**
 * Get date and time for logging
 * @param d | date
 * @returns object
 */
const getDateForLogRecord = (d) => {
  const date = `${d.getFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  const time = getTime(d.getUTCHours(), d.getUTCMinutes());

  return {
    date,
    time,
  };
};

/**
 * Prepare logging data for adding record on spreadsheet via api access
 *
 * @param message | discord object
 * @param event | string
 * @returns object
 */
const prepareLoggedData = (message, event) => {
  const dateAt = new Date(message.createdAt);
  const nickname = getAvailableAccountName(message);
  const { date, time } = getDateForLogRecord(dateAt);

  return {
    ALLIANCE: getAllianceTag(nickname),
    NAME: getPlayerName(nickname),
    ACTION: event,
    DATE: date,
    TIME: time,
  };
};

/**
 * Add log record to google spreadsheet
 *
 * @param record | object
 */
const addLogRecord = async (record) => {
  const sheet = await initGoogleSpreadsheetConnection(
    config.SPREADSHEET_ID,
    config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    config.GOOGLE_PRIVATE_KEY
  );

  await sheet.addRow(record);
};

/**
 * Add or remove
 * Protocol Officer role from user
 * @param id | discord id
 * @param condition | boolean
 * @param message | discord message
 */
const addOrRemoveRoleFromUser = (id, condition, message) => {
  message.guild.members.fetch(id).then((info) => {
    const role = findServerRoleByName(message, getConfig(message, "PO_ROLE"));
    if (condition) {
      info.roles.add(role);
    } else {
      info.roles.remove(role);
    }
  });
};

module.exports = {
  prepareLoggedData,
  addLogRecord,
  getPlayerName,
  addOrRemoveRoleFromUser,
};
