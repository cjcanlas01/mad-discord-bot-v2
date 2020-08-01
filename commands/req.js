/**
 */
const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();
const { readJson } = require("../common/utilities");

module.exports = {
  name: "req",
  description: "Compute requested resources transport count.",
  syntax: `${config.PREFIX1}req <resource type>-<amount>`,
  execute(message) {
    const computeLoadCount = (data, resourceCount) => {
      const TAX_RATE = Number(data.TRANSPORT_TAX);
      const TRANSPORT_AMT = Number(data.MAX_TRANSPORT_AMOUNT);

      if (!TAX_RATE || !TRANSPORT_AMT) {
        return false;
      }

      // Final deliverable amount of bank
      let deliverableAmt = TRANSPORT_AMT - (TRANSPORT_AMT * TAX_RATE) / 100;
      deliverableAmt = deliverableAmt.toString().slice(0, 3);
      deliverableAmt = Number((deliverableAmt / 100).toFixed(2));
      // Count for how many times bank should hit transport
      const transportCount = (resourceCount / deliverableAmt).toFixed(2);
      // Separate full and last load count
      const [wholeCount, decimalCount] = transportCount.split(".");
      // console.log([wholeCount, decimalCount / 100, deliverableAmt]);
      let decimalAmount = deliverableAmt * (decimalCount / 100);
      decimalAmount = decimalAmount.toFixed(2);
      const decimalInMillions = decimalAmount * 1000000;
      const MAGIC_AMOUNT = 10000;

      for (
        let lastLoad = decimalInMillions;
        lastLoad <= TRANSPORT_AMT;
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
          const isDivisbleToDeliverableAmt =
            wholeCount * deliverableAmt == resourceCount ? true : false;

          if (isDivisbleToDeliverableAmt) {
            return `Send **${wholeCount}** full loads.`;
          }

          lastLoad = lastLoad + MAGIC_AMOUNT;
          return `Send **${wholeCount}** full loads and **${lastLoad}** for last load.`;
        }
      }
    };

    readJson("./settings.json").then((data) => {
      let parsedRequest = message.content
        .split(" ")
        .filter((el) => el != "!req")
        .map((el) => {
          el = el.split("-");
          const loadDetails = computeLoadCount(data, el[1]);

          if (!loadDetails) {
            message.channel.send("Set transport tax and amount first!");
            return false;
          }

          return {
            name: `__${el[0].charAt(0).toUpperCase() + el[0].slice(1)}__`,
            value: `**Amount**: ${el[1]} million.
          ---  
          ${loadDetails}`,
            inline: true,
          };
        });

      // Used to show who requested the rss
      // parsedRequest.unshift({
      //   name: "Request by:",
      //   value: message.author,
      // });

      if (parsedRequest[0]) {
        message.channel.send(embed(parsedRequest, "Bank Request Report"));
      }
    });
  },
};
