const {
  displayQueue,
  hasPoAccessRole,
  messageForUserThatHasNoPoAccess,
} = require("../common/utilities");
const config = require("../common/getConfig")();

module.exports = {
  name: "reset-queue",
  description: "Reset title queue.",
  syntax: `${config.PREFIX}reset-queue`,
  po: true,
  async execute(message) {
    // Check if user has proper role for access
    if (!hasPoAccessRole(message)) {
      messageForUserThatHasNoPoAccess(message);
      return false;
    }

    const queue = [
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

    message.channel.send("Title queue is empty now.");
    displayQueue(message, queue);
  },
};
