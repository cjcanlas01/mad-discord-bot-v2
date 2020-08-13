/**
 */
const config = require("../common/getConfig")();
const { readJson, writeJson } = require("../common/utilities");

module.exports = {
  name: "set-time-mad",
  description: "Set time bubbled for MAD bank.",
  syntax: `${config.PREFIX1}set-time-mad`,
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

    const fileName = "./data/time-store.json";
    const datetime = prepBubbleTime(truceValue);
    if (datetime) {
      readJson(fileName).then((data) => {
        // Set transport amount

        data["MAD-BANK"] = prepBubbleTime(truceValue);
        data["MAD-CHECK"] = false;

        writeJson(fileName, data).then((data) => {
          if (data == "File update success!") {
            message.channel.send(
              "Bubbled time value for MAD bank is updated! Thank you."
            );
            return false;
          }
        });
      });
    } else {
      message.channel.send("Please input the correct format. Thank you.");
    }
  },
};
