const config = require("../common/getConfig")();

module.exports = {
  name: "purge",
  description: "Empty all messages of current channel.",
  syntax: `${config.PREFIX}purge`,
  includes: true,
  execute(message) {
    const checkIfWordsExists = (content, words) => {
      const parsedWords = words.split(",");
      if (parsedWords.includes(content)) {
        return true;
      }

      return false;
    };
    /**
     * Command: |purge options: count-<numer> filter-<word/ words>
     */
    let purge = {
      msg: "",
      precedent: ["count", "filter"],
      count: function (num) {
        this.msg = this.msg.slice(0, num);
      },
      filter: function (words) {
        const filteredMsg = this.msg.filter((el) => {
          return el.content.split(" ").some((el) => {
            return checkIfWordsExists(el.toLowerCase(), words);
          });
        });

        if (filteredMsg.length >= 1) {
          this.msg = filteredMsg;
        }
      },
      purgedMsg: function () {
        return this.msg;
      },
    };

    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("", {
        files: ["./images/you-have-no-power-here.jpg"],
      });
      return;
    }

    if ((message.channel.type = "text")) {
      message.channel.messages
        .fetch()
        .then((messages) => {
          // Set list of messages for purge function
          purge.msg = messages.array();
          let optionSelected = message.content.split(" ");
          optionSelected.shift();
          const parsedOptions = optionSelected.map((val) => val.split("="));
          // Purge message
          for (option of parsedOptions) {
            const [opt, parameter] = option;
            purge[opt](parameter);
          }
          // let a = messages.filter((el) => {
          //   return el.content.split(" ").some((el) => {
          //     // console.log(el.toLowerCase().replace(/[^0-9a-z]/gi, ""));
          //     return el.toLowerCase() == "rape";
          //   });
          // });
          // messagesDeleted = purge.msg.array().length; // number of messages deleted
          // for (data of purge.purgedMsg().array()) {
          //   console.log(data.content);
          // }
          // console.log(purge.purgedMsg());
          message.channel.bulkDelete(purge.purgedMsg());

          // Logging the number of messages deleted on both the channel and console.
          // message.channel.send(
          //   "Deletion of messages successful. Total messages deleted: " +
          //     messagesDeleted
          // );
          // console.log(
          //   "Deletion of messages successful. Total messages deleted: " +
          //     messagesDeleted
          // );
        })
        .catch((err) => {
          console.log("Error while doing Bulk Delete");
          console.log(err);
        });
    }
  },
};
