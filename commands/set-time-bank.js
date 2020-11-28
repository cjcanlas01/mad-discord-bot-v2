/**
 */
const config = require("../common/getConfig")();
const { getSetCallData } = require("../common/trackingSystem");

module.exports = {
  name: "set-time-bank",
  description: "Set time bubbled for bank.",
  syntax: `${config.PREFIX1}set-time-bank`,
  execute(message) {
    // Lazy to remove file, added config to disable command on being called
    if (!config.AVAILABLE) {
      return false;
    }

    const truceValue = message.content.split(" ")[1];

    if (!truceValue) {
      message.channel.send("Missing input. Please try again.");
      return false;
    }

    const prepBubbleTime = (truceValue) => {
      truceValue = truceValue.split("");
      const timeForm = truceValue.pop();
      const duration = truceValue.join("");
      const d = new Date();

      if (Number.isInteger(Number(timeForm))) {
        return false;
      }

      switch (timeForm) {
        case "h":
          d.setHours(d.getHours() + Number(duration));
          break;
      }

      let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let time = `${d.getHours()}:${d.getMinutes()}`;

      return date + " " + time;
    };

    const datetime = prepBubbleTime(truceValue);
    if (datetime) {
      getSetCallData(
        "BANK",
        datetime,
        "SET",
        true,
        "BANK_CHECK",
        "FALSE"
      ).then((isTrue) => {
        if (isTrue) {
          message.channel.send(
            "Bubbled time value for bank is updated! Thank you."
          );
        } else {
          message.channel.send("Please input the correct format. Thank you.");
        }
      });
    } else {
      message.channel.send("Please input the correct format. Thank you.");
    }
  },
};
