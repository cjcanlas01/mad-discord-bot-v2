/**
 */
const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();
const { prepareRequest } = require("../common/utilities");
const { getSettings } = require("../config/settings");
const settings = getSettings();

module.exports = {
  name: "req-bb",
  description: "Compute requested resources transport count.",
  syntax: `${config.PREFIX}req-bb [resource type]-[amount]`,
  execute(message) {
    const bank = settings.BANK.BBLUVSYOU;
    const preparedRequest = prepareRequest(message, bank, this.name);
    if (preparedRequest.length >= 1) {
      message.channel.send(embed(preparedRequest, "Bank Request Report"));
    }
  },
};
