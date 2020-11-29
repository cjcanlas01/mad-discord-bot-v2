const fs = require("fs");
const path = require("path");
const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();
const settings = require("../settings.json");
const { getCurrentPO } = require("../common/trackingSystem");

/**
 * Function to read file on prorject dir
 * @param dir | Folder name + filename
 * @returns Promise
 */
const readJson = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), dir), "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data);
        if (json) {
          resolve(json);
        }
      }
    });
  });
};

/**
 * Function to write any file on project dir
 * @param dir | Folder name + filename
 * @param data | json
 * @returns Promise
 */
const writeJson = (dir, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(process.cwd(), dir),
      JSON.stringify(data),
      "utf8",
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve("File update success!");
        }
      }
    );
  });
};

/**
 * Function to display and update queue embed on specific channel
 * @param message | Discord Message
 */
const displayQueue = (message) => {
  const channel = message.guild.channels.cache.find(
    (ch) => ch.name === settings.QUEUE_CHANNEL
  );
  // For deleting message
  channel
    .bulkDelete(100)
    .then((msg) => {
      readJson("/data/queue.json")
        .then((json) => {
          const title = "**K40 Title Queue**";
          const footer =
            "MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD! MAD!";
          channel.send(embed(json, title, footer));
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

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
 * Function to get user name
 * @param message | Discord Message
 */
const getUser = (message) => {
  // Ignore this collection of words as third argument
  const ignore = ["pls", "please", "plz", "pls?", "please?", "plz"];

  const msgContent = message.content.split(" ");
  let userContent = msgContent.filter((elem) => {
    return !elem.startsWith("<") && !elem.startsWith("!");
  });

  if (userContent.length > 1) {
    userContent = userContent.join(" ");
  } else {
    userContent = userContent.toString();
  }

  let user;
  if (userContent && !ignore.includes(userContent)) {
    user = userContent;
  } else {
    let nickname = message.guild.member(message.author).nickname;
    if (nickname) {
      user = nickname;
    } else {
      user = message.guild.member(message.author).user.username;
    }
  }

  return user;
};

const poSystem = (message, buffTitle) => {
  readJson("/data/buff-mode.json")
    .then((buffData) => {
      if (buffData) {
        const buffMode = buffData["buff-mode"];

        if (
          // Determine if buff mode is inactive and title requested is Lord Commander
          (!buffMode && buffTitle == titleConstants().LORD_COMMANDER) ||
          // Determine if buff mode is active and title other than Lord Commander is requested
          (buffMode && buffTitle != titleConstants().LORD_COMMANDER) ||
          // Check if there is a Protocol Officer online
          !getCurrentPO(message)
        ) {
          message.react("❌");
          return false;
        }

        /**
         * Function for checking if requesting user is part of any queue
         * @param data | queue object
         * @param user | requesting user
         */
        const checkIfUserIsInQueue = (data, user) => {
          for (let i = 0; i < data.length; i++) {
            const value = data[i]["value"];

            if (value.includes(user)) {
              return true;
            }
          }

          return false;
        };

        const user = getUser(message);
        // Get current list first
        readJson("/data/queue.json")
          .then((queue) => {
            // For determining if need to write on json file
            let isUpdate = true;
            let queueObj = Object.keys(queue).map((elem) => {
              let obj = queue[elem];
              // Find corresponding buff title
              if (obj["name"] == buffTitle) {
                let value = obj["value"];
                // Find if user is already in queue
                if (checkIfUserIsInQueue(queue, user)) {
                  message.channel.send(
                    "You are already in a queue! Please finish the current one first. Thank you."
                  );
                  isUpdate = false;
                } else {
                  if (!Array.isArray(value)) {
                    value = [];
                  }

                  value.push(user);
                  message.react("☑️");
                  message.channel.send(
                    `${message.author}, ${user} added to the ${buffTitle} queue.`
                  );
                }
                obj["value"] = value;
              }
              return obj;
            });

            if (isUpdate) {
              // Update queue json file
              writeJson("/data/queue.json", queueObj)
                .then((data) => {
                  console.log(data);
                  displayQueue(message);
                })
                .catch((err) => {
                  throw new Error(err);
                });
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const removeNameInQueue = (message, user) => {
  /**
   * Modify function from utilities.js
   * Returns true if title record has requesting user in it
   */
  const checkIfUserIsInQueue = (data, user) => {
    const value = data["value"];
    if (Array.isArray(value) && value.includes(user)) {
      return true;
    }

    return false;
  };

  readJson("/data/queue.json")
    .then((queue) => {
      /**
       * Find corresponding title buff where user is in queue
       * If true, return specific record where user is included
       */
      let hasExistingUser;
      for (let i = 0; i < queue.length; i++) {
        let obj = queue[i];
        if (checkIfUserIsInQueue(obj, user)) {
          hasExistingUser = obj;
          break;
        }
      }

      if (hasExistingUser) {
        // Filter out requesting user from the list
        hasExistingUser.value = hasExistingUser.value.filter((val) => {
          return val != user;
        });

        // If list is empty, update value with default
        if (hasExistingUser.value.length <= 0) {
          hasExistingUser.value = "[EMPTY]";
        }

        // If all is good, update queue json file
        writeJson("/data/queue.json", queue)
          .then((data) => {
            console.log(data);
            if (data) {
              message.react("✅");
            }
            displayQueue(message);
          })
          .catch((err) => {
            throw new Error(err);
          });
      } else {
        message.channel.send("You are not in any queue.");
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};

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

const findChannelByName = (message, channelName) => {
  return message.guild.channels.cache.find((ch) => ch.name == channelName);
};

module.exports = {
  readJson,
  writeJson,
  poSystem,
  titleConstants,
  displayQueue,
  removeNameInQueue,
  getUser,
  hasPoAccessRole,
  findChannelByName,
};
