const config = require("../common/getConfig")();

module.exports = {
  name: "tealc",
  description: "Your every day phrases for our beloved tealc.",
  syntax: `${config.PREFIX}tealc`,
  includes: true,
  execute(message) {
    const messages = [
      "Tealc, the first of his name, the bringer of death, the yolo of solo, the giver of herpes... i mean it flows",
      "Tealc, you mean the toucher of tips?",
      "I wouldnt send foreskin, i have herpes remember. If our tips touch you are likely to also get it",
    ];

    const randomInteger = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomNumber = randomInteger(0, messages.length - 1);
    message.channel.send(messages[randomNumber]);
  },
};
