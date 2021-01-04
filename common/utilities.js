const fs = require("fs");
const path = require("path");
const embed = require("../common/discordEmbed");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { getSettings } = require("../config/settings");
const settings = getSettings();

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
        return data.name == settings.PO_ROLE;
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
 * Read specified file on specified directory
 * @param dir | folder name + filename
 * @returns promise
 */
const readJson = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), dir), "utf8", (err, data) => {
      if (err) {
        reject({
          success: false,
          err: err,
        });
      } else {
        const json = JSON.parse(data);
        if (json) {
          resolve({
            success: true,
            result: json,
          });
        }
      }
    });
  });
};

/**
 * Update/ write specified file on specified directory
 * @param dir | folder name + filename
 * @param data | json
 * @returns promise
 */
const writeJson = (dir, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(process.cwd(), dir),
      JSON.stringify(data),
      "utf8",
      (err, data) => {
        if (err) {
          reject({
            success: false,
            err: err,
          });
        } else {
          resolve({
            success: true,
            result: "File updated successfully.",
          });
        }
      }
    );
  });
};

/**
 * Display title queue on specified channel
 * @param message | discord message
 */
const displayQueue = async (message) => {
  /**
   * Object for queue details
   * for easy modification
   */
  const queueDetails = {
    title: "**K40 Title Buff Queue**",
    footer:
      "MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD!",
  };
  const channel = findChannelByName(message, settings.QUEUE_CHANNEL);
  /**
   * Delete channel messages
   * up to 100
   */
  await channel.bulkDelete(100);
  const r = await readJson("/data/queue.json");

  if (r.success) {
    channel.send(embed(r.result, queueDetails.title, queueDetails.footer));
  } else {
    channel.send("Oops. Something went wrong...");
  }
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

  return accountDetail.user.name;
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
 * @param queue | json
 * @param user | string
 * @returns boolean
 */
const checkIfUserIsInQueue = (queue, requestingUser) => {
  const q = queue.value;
  if (Array.isArray(q) && q.includes(requestingUser)) {
    return true;
  }

  return false;
};

const queueingSystem = async (message, titleBuff) => {
  const r = await readJson("/data/buff-mode.json");

  if (r.success) {
    const d = r.result;
    const mode = d["buff-mode"];
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
    const queue = await readJson("/data/queue.json");

    if (queue.success) {
      // Modify queue for new command requested
      let result = queue.result;
      for (let title of result) {
        if (title.name == titleBuff) {
          if (checkIfUserIsInQueue(title, requestingUser)) {
            message.channel.send(
              "You are already in a queue! Please finish the current one first. Thank you."
            );
            break;
          } else {
            if (!Array.isArray(title.value)) {
              title.value = [];
            }

            // Add current requesting user to the queue
            title.value.push(requestingUser);

            const isQueueUpdated = await writeJson("data/queue.json", result);
            if (isQueueUpdated) {
              message.react("☑️");
              message.channel.send(
                `${message.author}, ${requestingUser} added to the ${titleBuff} queue.`
              );
              displayQueue(message);
            }
            break;
          }
        }
      }
    }
  }
};

const removeNameInQueue = async (message, requestingUser) => {
  const r = await readJson("/data/queue.json");

  if (r.success) {
    /**
     * Get title queue of
     * where requesting user exists
     */
    let result = r.result;
    let titleWhereRequestingUserExists;
    for (let titles of result) {
      if (checkIfUserIsInQueue(titles, requestingUser)) {
        // Filter out requesting user from the title
        titles.value = titles.value.filter((e) => {
          return e != requestingUser;
        });

        // Replace empty queue array with empty indicator
        if (titles.value.length <= 0) {
          titles.value = "[EMPTY]";
        }

        const isUpdated = await writeJson("/data/queue.json", result);
        if (isUpdated.success) {
          message.react("✅");
          displayQueue(message);
        } else {
          message.channel.send("You are not in any queue.");
        }
        break;
      }
    }
  }
};

/**
 * Check if there is any person
 * that has PO role
 */
const hasPoAccessRole = (message) => {
  if (
    message.member.roles.cache.find(
      (role) => role.name === settings.PO_ACCESS_ROLE
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
  if (message.channel.name != settings.BUFF_CHANNEL) {
    return false;
  }

  return true;
};

/**
 * Send messages if user has no PO role
 */
const messageForUserThatHasNoPoAccess = (message) => {
  message.channel.send(
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
      message.channel.send("Set transport tax and amount first!");
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
const isArrayEmpty = (arr) => {
  return arr.length == 0 ? true : false;
};

module.exports = {
  readJson,
  writeJson,
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
};
