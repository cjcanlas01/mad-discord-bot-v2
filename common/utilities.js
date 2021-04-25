const fs = require("fs");
const path = require("path");
const embed = require("../common/discordEmbed");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const m = require("../models/index");

const getBuffMode = async () => {
  const getBuffMode = await m.Config.findAll({
    attributes: ["config", "value"],
    where: {
      config: "BUFF_MODE",
    },
  });

  return getBuffMode[0].dataValues.value;
};

const setBuffMode = async (value) => {
  const updateBuffMode = await m.Config.update(
    { value: value },
    {
      where: {
        config: "BUFF_MODE",
      },
    }
  );
  return updateBuffMode;
};

const getConfig = (message, config) => {
  return message.client.configs.get(config);
};

const getBank = (message, bank) => {
  return message.client.banks.get(bank);
};

const getWelcomeMsgs = (message, guild) => {
  return message.client.welcomeMsgs.get(guild);
};

/**
 * Identify if there is current user with Protocol officer role
 *
 * @param message | discord message
 * @return  boolean or object
 */
const getUserWithPoRole = (message) => {
  /**
   * Get list of all member that
   * currently has Protocol Officer role
   */
  const poList = message.guild.members.cache
    .filter((member) => {
      return member.roles.cache.find((data) => {
        return data.name == getConfig(message, "PO_ROLE");
      });
    })
    .map((member) => {
      return {
        nickname: member.nickname || member.user.username,
        id: member.id,
      };
    });
  /**
   * Check if there are more active
   * user with Protocol Officer role
   */
  if (poList.length > 1) {
    return false;
  }

  // Check if there is no Protocol officer
  if (poList.length < 1) {
    return false;
  }

  return poList;
};

/**
 * Find discord channel object
 * @param message | discord message
 * @param channelName | string
 * @returns discord channel
 */
const findChannelByName = (message, channelName) => {
  return message.guild.channels.cache.find((ch) => ch.name == channelName);
};

/**
 * Find discord role object
 * @param message | discord message
 * @param roleName | string
 * @returns discord role
 */
const findServerRoleByName = (message, roleName) => {
  return message.guild.roles.cache.find((r) => r.name == roleName);
};

/**
 * Display title queue on specified channel
 * @param message | discord message
 */
const displayQueue = async (message, fields) => {
  /**
   * Object for queue details
   * for easy modification
   */
  const queueDetails = {
    title: "**K40 Title Buff Queue**",
    footer:
      "MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD!",
  };
  const channel = findChannelByName(
    message,
    getConfig(message, "QUEUE_CHANNEL")
  );
  /**
   * Delete channel messages
   * up to 100
   */
  await channel.bulkDelete(100);
  channel.send(embed(fields, queueDetails.title, queueDetails.footer));
};

/**
 * Container for title buffs
 * used for the queueing system
 */
const titleConstants = () => {
  return {
    GRAND_MAESTER: "Grand Maester",
    CHIEF_BUILDER: "Chief Builder",
    MASTER_OF_SHIPS: "Master of Ships",
    MASTER_OF_WHISPERERS: "Master of Whisperers",
    LORD_COMMANDER: "Lord Commander",
  };
};

/**
 * Get available account name
 * from discord, options are:
 * - account name
 * - server nickname
 * @param message | discord message
 * @returns string
 */
const getAvailableAccountName = (message) => {
  const accountDetail = message.guild.member(message.author);
  if (accountDetail.nickname) {
    return accountDetail.nickname;
  }

  return accountDetail.user.username;
};

/**
 * Get user account username or nickname
 * @param message | discord message
 * @returns string
 */
const getAccountNameFromCommandRequest = (message) => {
  // Keywords to ignore
  const ignore = ["pls", "please", "plz", "pls?", "please?", "plz"];

  const content = message.content.split(" ");
  let filteredContent = content.filter((e) => {
    return !e.startsWith("<") && !e.startsWith("!");
  });

  // Create one whole string from values left after filter
  if (filteredContent.length > 1) {
    filteredContent = filteredContent.join(" ");
  } else {
    filteredContent = filteredContent.toString();
  }

  // Check if there a third argument present (alt's name)
  if (filteredContent && !ignore.includes(filteredContent)) {
    return filteredContent;
  }

  // Else send default account or server name
  return getAvailableAccountName(message);
};

/**
 * Check for requesting user
 * if currently included
 * on any queue
 *
 * @param queue | object
 * @param requestingUser | string
 * @param searchAll | boolean
 * @returns boolean
 */
const checkIfUserIsInQueue = (queue, requestingUser, searchAll = false) => {
  // Find user on title queue
  const findInQueue = (q, user) => {
    if (Array.isArray(q.value) && q.value.includes(user)) return true;
    return false;
  };

  if (searchAll) {
    for (const q of queue) {
      if (findInQueue(q, requestingUser)) return true;
    }
    return false;
  }

  return findInQueue(queue, requestingUser);
};

/**
 * Get queue fields from
 * discord message object
 *
 * @param {Object} channel
 * @returns Object
 */
const getQueueFields = async (channel) => {
  const queueMsg = await channel.messages.fetch();
  const fields = queueMsg.first().embeds[0].fields;
  const parsedFields = fields.map((title) => {
    title.value = title.value.split("\n");
    return title;
  });
  return parsedFields;
};

const queueingSystem = async (message, titleBuff) => {
  let buffMode = await getBuffMode();
  const mode = JSON.parse(buffMode);
  const title = titleConstants();
  if (
    // Determine if buff mode is inactive and title request is Lord Commander
    (!mode && titleBuff == title.LORD_COMMANDER) ||
    // Determine if buff mode is active and title other than Lord Commander is requested
    (mode && titleBuff != title.LORD_COMMANDER) ||
    // Check if there is a Protocol Officer active
    !getUserWithPoRole(message)
  ) {
    message.react("❌");
    return false;
  }

  const requestingUser = getAccountNameFromCommandRequest(message);
  const channel = findChannelByName(
    message,
    getConfig(message, "QUEUE_CHANNEL")
  );
  let fields = await getQueueFields(channel);
  if (checkIfUserIsInQueue(fields, requestingUser, true)) {
    return post(
      message,
      "You are already in a queue! Please finish the current one first. Thank you."
    );
  }

  for (let title of fields) {
    if (title.name != titleBuff) continue;

    const empty = "[EMPTY]";
    if (title.value.includes(empty)) {
      title.value = title.value.filter((v) => v != empty);
    }

    title.value.push(requestingUser);
    displayQueue(message, fields);
    message.react("☑️");
    return post(
      message,
      `${message.author}, ${requestingUser} added to the ${titleBuff} queue.`
    );
  }
};

const removeNameInQueue = async (message, requestingUser) => {
  const channel = findChannelByName(
    message,
    getConfig(message, "QUEUE_CHANNEL")
  );
  let fields = await getQueueFields(channel);
  for (let title of fields) {
    if (!checkIfUserIsInQueue(title, requestingUser)) continue;

    title.value = title.value.filter((e) => e != requestingUser);
    if (title.value.length <= 0) {
      title.value = "[EMPTY]";
    }

    displayQueue(message, fields);
    message.react("☑️");
    return;
  }

  return post(message, "You are not in any queue.");
};

/**
 * Check if there is any person
 * that has PO role
 */
const hasPoAccessRole = (message) => {
  if (
    message.member.roles.cache.find(
      (role) => role.name === getConfig(message, "PO_ACCESS_ROLE")
    )
  ) {
    return true;
  }

  return false;
};

/**
 * Format date object
 * to return datetime
 */
const getDateTime = (d) => {
  const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const time = `${d.getHours()}:${d.getMinutes()}`;

  return date + " " + time;
};

/**
 * Check if channel is buff channel
 */
const checkChannelIfBuffChannel = (message) => {
  if (message.channel.name != getConfig(message, "BUFF_CHANNEL")) {
    return false;
  }

  return true;
};

/**
 * Send messages if user has no PO role
 */
const messageForUserThatHasNoPoAccess = (message) => {
  post(
    message,
    `${message.author.toString()}, you do not have access for Protocol Officer!`
  );
};

/**
 * Established google spreadsheet connection
 * and select first sheet by default
 */
const initGoogleSpreadsheetConnection = async (
  googleSpreadSheetId,
  serviceAccountEmail,
  privateKey
) => {
  const doc = new GoogleSpreadsheet(googleSpreadSheetId);
  await doc.useServiceAccountAuth({
    client_email: serviceAccountEmail,
    private_key: privateKey,
  });
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
};

/**
 * Get value from spreadsheet cell
 */
const getSheetCellVal = (sheet, cell) => {
  return sheet.getCellByA1(cell).value;
};

/**
 * Compute and get request load
 * @param bankDetail | object
 * @param resourceCount | integer
 * @returns string
 */
const computeRequestCount = (bankDetail, resourceCount) => {
  const TAX_RATE = Number(bankDetail.TRANSPORT_TAX);
  const TRANSPORT_AMOUNT = Number(bankDetail.TRANSPORT_AMOUNT);

  // Check if bank detail is missing
  if (!TAX_RATE || !TRANSPORT_AMOUNT) return false;

  // Compute delivery amount
  let deliverableAmount =
    TRANSPORT_AMOUNT - (TRANSPORT_AMOUNT * TAX_RATE) / 100;
  deliverableAmount = deliverableAmount.toString().slice(0, 3);
  deliverableAmount = Number((deliverableAmount / 100).toFixed(2));

  // Count how many times bank should hit transport
  const loadCount = (resourceCount / deliverableAmount).toFixed(2);

  // Separate full and last load count
  const [wholeNumber, decimalNumber] = loadCount.split(".");
  let decimalAmount = deliverableAmount * (decimalNumber / 100);
  decimalAmount = decimalAmount.toFixed(2);
  const decimalInMillions = decimalAmount * 1000000;
  // Place holder to complete computed value
  const MAGIC_AMOUNT = 10000;

  for (
    let lastLoad = decimalInMillions;
    lastLoad <= TRANSPORT_AMOUNT;
    lastLoad++
  ) {
    const findAmount = lastLoad - (lastLoad * TAX_RATE) / 100;
    /**
     * Find transport amount by
     * incrementing value from decimal value and
     * computing value with transport tax amount deducted
     * then compare to given decimal value
     */
    if (Math.trunc(findAmount) == Math.trunc(decimalInMillions)) {
      const isDivisbleToDeliverableAmount =
        wholeNumber * deliverableAmount == resourceCount ? true : false;

      if (isDivisbleToDeliverableAmount) {
        return `Send **${wholeNumber}** full loads.`;
      }

      lastLoad = lastLoad + MAGIC_AMOUNT;
      return `Send **${wholeNumber}** full loads and **${lastLoad}** for last load.`;
    }
  }
};

/**
 * Prepare and get result of bank request
 * @param message
 * @param bankDetail
 * @returns object
 */
const prepareRequest = (message, bankDetail, command) => {
  let request = message.content.split(" ").filter((e) => e != `!${command}`);
  let preparedRequest = [];
  for (req of request) {
    req = req.split("-");
    const [resourceType, amount] = req;
    const load = computeRequestCount(
      {
        TRANSPORT_TAX: bankDetail.TRANSPORT_TAX,
        TRANSPORT_AMOUNT: bankDetail.TRANSPORT_AMOUNT,
      },
      amount
    );

    if (!load) {
      post(message, "Set transport tax and amount first!");
      break;
    }

    preparedRequest.push({
      name: `__${
        resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
      }__`,
      value: `**Amount**: ${amount} million.
      ---
      ${load}`,
      inline: true,
    });
  }

  return preparedRequest;
};

/**
 * Check if array is empty
 * @param {array} arr
 */
const isArrayEmpty = (arr) => Array.isArray(arr) && arr.length === 0;

/**
 * Post a message into a discord channel
 * @param message {Object} message object for Discord info
 * @param str {String} text you wish to send to a channel
 */
const post = (message, str) => message.channel.send(str);

module.exports = {
  getDateTime,
  isArrayEmpty,
  displayQueue,
  queueingSystem,
  titleConstants,
  prepareRequest,
  getSheetCellVal,
  hasPoAccessRole,
  getUserWithPoRole,
  findChannelByName,
  removeNameInQueue,
  findServerRoleByName,
  getAvailableAccountName,
  checkChannelIfBuffChannel,
  getAccountNameFromCommandRequest,
  initGoogleSpreadsheetConnection,
  messageForUserThatHasNoPoAccess,
  post,
  getConfig,
  getBank,
  getWelcomeMsgs,
  getBuffMode,
  setBuffMode,
};
