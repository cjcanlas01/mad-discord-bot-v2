const settings = require("../config/settings")();
const { findChannelByName } = require("../common/utilities");

module.exports = bootstrapBubble = (client) => {
  const notificationChannel = findChannelByName(settings.MANAGEMENT_CHANNEL);
};
