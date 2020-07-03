const { writeJson, displayQueue, hasPoAccess } = require("../common/utilities");
const { msgPoHasNoAccess } = require("../common/messages");
const config = require("../common/getConfig")();

module.exports = {
  name: "reset-queue",
  description: "Reset title queue.",
  syntax: `${config.PREFIX1}reset-queue`,
  includes: true,
  execute(message) {
    // Check if user has proper role for access
    if (!hasPoAccess(message)) {
      msgPoHasNoAccess(message);
      return false;
    }

    const queueObj = [
      {
        name: "Chief Builder",
        value: "[EMPTY]",
        inline: true,
      },
      {
        name: "Grand Maester",
        value: "[EMPTY]",
        inline: true,
      },
      {
        name: "Master of Ships",
        value: "[EMPTY]",
        inline: true,
      },
      {
        name: "Master of Whisperers",
        value: "[EMPTY]",
        inline: true,
      },
      {
        name: "Lord Commander",
        value: "[EMPTY]",
        inline: true,
      },
    ];

    writeJson("/data/queue.json", queueObj)
      .then((data) => {
        message.channel.send("Title queue is empty now.");
        displayQueue(message);
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
};
