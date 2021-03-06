/**
 * Computes bank requirements and returns if request is available or not
 */
const embed = require("../common/discordEmbed");
const account = require("../modules/accounting.min");
const config = require("../common/getConfig")();

module.exports = {
  name: "calc",
  description: "Compute for bank requirement.",
  syntax: `${config.PREFIX}calc [shipped] [delivered] [requested]`,
  includes: true,
  execute(message, args) {
    const [shipped, delivered, requested] = args;
    const percentMultiplicator = 5;

    const totalBalance = Number(shipped) * percentMultiplicator;
    const availableBalance = totalBalance - Number(delivered);
    const requestResult =
      requested <= availableBalance ? ":thumbsup:" : ":thumbsdown:";
    let output;

    if (shipped && delivered && requested) {
      output = [
        {
          name: "Total balance",
          value: account.formatNumber(totalBalance),
          inline: true,
        },
        {
          name: "Available balance",
          value: account.formatNumber(availableBalance),
          inline: true,
        },
        { name: "Requested", value: requestResult },
      ];
    } else {
      output = [{ name: "ALERT", value: "Please input required values!" }];
    }

    message.channel.send(embed(output));
  },
};
