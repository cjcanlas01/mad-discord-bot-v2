/**
 */
const config = require("../common/getConfig")();
const { readJson, writeJson } = require("../common/utilities");

module.exports = {
  name: "set-time-mad",
  description: "Set time bubbled for MAD bank.",
  syntax: `${config.PREFIX1}set-time-mad`,
  execute(message) {
    const truceValue = message.content.split(" ")[1];

    if (!truceValue) {
      message.channel.send("Missing input. Please try again.");
      return false;
    }

    const prepBubbleTime = (truceValue) => {
      // const acceptableTruceValue = ["4h", "8h", "1d", "3d", "7d", "14d"];

      // if (!acceptableTruceValue.find((el) => el == truceValue)) {
      //   message.channel.send("Wrong input. Please try again.");
      //   return false;
      // }

      truceValue = truceValue.split("");
      const timeForm = truceValue.pop();
      const duration = truceValue.join("");
      const d = new Date();

      switch (timeForm) {
        case "h":
          d.setHours(d.getHours() + Number(duration));
          break;

        case "d":
          d.setDate(d.getDate() + Number(duration));
          break;
      }

      let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let time = `${d.getHours()}:${d.getMinutes()}`;

      return date + " " + time;
    };

    const fileName = "./data/time-store.json";
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
  },
};
