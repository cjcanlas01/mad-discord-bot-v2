const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();
const { prepareRequest, getBank } = require("../common/utilities");

module.exports = {
  name: "req-iron",
  description: "Compute requested resources transport count.",
  syntax: `${config.PREFIX}req-iron [resource type]-[amount]`,
  execute(message) {
    const bank = getBank(message, "IRONBANK");
    const preparedRequest = prepareRequest(message, bank, this.name);
    if (preparedRequest.length >= 1) {
      message.channel.send(embed(preparedRequest, "Bank Request Report"));
    }
  },
};
