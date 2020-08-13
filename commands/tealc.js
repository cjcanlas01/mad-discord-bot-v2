// const embed = require("../common/discordEmbed");
const config = require("../common/getConfig")();

module.exports = {
  name: "tealc",
  description: "Your every day phrases for our beloved tealc.",
  syntax: `${config.PREFIX1}tealc`,
  includes: true,
  execute(message) {
    const tealcMessage = [
      "Tealc, the first of his name, the bringer of death, the yolo of solo, the giver of herpes... i mean it flows",
      "Tealc, you mean the toucher of tips?",
      "I wouldnt send foreskin, i have herpes remember. If our tips touch you are likely to also get it",
    ];

    const randomInteger = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomNum = randomInteger(0, tealcMessage.length - 1);
    message.channel.send(tealcMessage[randomNum]);
  },
};
