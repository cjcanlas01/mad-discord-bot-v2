/**
 */
const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();

module.exports = {
  name: "req",
  description: "Compute requested resources transport count.",
  syntax: `${config.PREFIX1}req <resource type>-<amount>`,
  execute(message) {
    const computeLoadCount = (resourceCount) => {
      const TAX_RATE = 7.2;
      const TRANSPORT_AMT = 4110000;
      let deliverableAmt = TRANSPORT_AMT - (TRANSPORT_AMT * TAX_RATE) / 100;
      deliverableAmt = deliverableAmt.toString().slice(0, 3);
      deliverableAmt = Number((deliverableAmt / 100).toFixed(2));

      return Math.ceil((resourceCount / deliverableAmt).toFixed(2));
    };

    let parsedRequest = message.content
      .split(" ")
      .filter((el) => el != "!req")
      .map((el) => {
        el = el.split("-");
        return {
          name: el[0].charAt(0).toUpperCase() + el[0].slice(1),
          value: `Amount: ${el[1]} million.
          Send resource ${computeLoadCount(el[1])} times.`,
          inline: true,
        };
      });

    parsedRequest.unshift({
      name: "Request by:",
      value: message.author,
    });

    message.channel.send(embed(parsedRequest, "Bank Request Report"));
  },
};
