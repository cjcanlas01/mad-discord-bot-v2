const fs = require("fs");
const Discord = require("discord.js");
const config = require("./common/getConfig")();
const settings = require("./settings.json");
const client = new Discord.Client();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { commandHandler } = require("./common/trackingSystem");

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity(`${config.PREFIX1}madhelp`, { type: "LISTENING" });

  if (config.AVAILABLE) {
    let channelId = client.channels.cache.find(
      (ch) => ch.name == settings.MANAGEMENT_CHANNEL
    );
    channelId = channelId.id;

    // Get duration between two times with 3 hours interval
    const getDateDurations = (dateTime) => {
      const dS = new Date(dateTime);
      dS.setHours(dS.getHours() - 3);
      const dateStart = `${dS.getFullYear()}-${
        dS.getMonth() + 1
      }-${dS.getDate()}`;
      const timeStart = `${dS.getHours()}:${dS.getMinutes()}`;

      const dE = new Date(dateTime);
      const dateEnd = `${dE.getFullYear()}-${
        dE.getMonth() + 1
      }-${dE.getDate()}`;
      const timeEnd = `${dE.getHours()}:${dE.getMinutes()}`;

      return [dateStart + " " + timeStart, dateEnd + " " + timeEnd];
    };

    const checkIfTimeNearEnd = (
      duration,
      check,
      currentDateTime,
      client,
      channelId,
      bankType
    ) => {
      check = check == "FALSE" ? false : true;
      if (duration && !check) {
        duration = getDateDurations(duration);
        // For checking time logs
        // console.log([
        //   new Date(currentDateTime) + " | " + new Date(duration[0]),
        //   new Date(currentDateTime) + " | " + new Date(duration[1]),
        // ]);
        if (
          new Date(currentDateTime) >= new Date(duration[0]) &&
          new Date(currentDateTime) <= new Date(duration[1])
        ) {
          let checkType;
          if (bankType == "MAD") {
            checkType = "B5";
          } else {
            checkType = "B4";
          }
          (async () => {
            const doc = new GoogleSpreadsheet(config.TIME_STORE_SPREADSHEET_ID);
            await doc.useServiceAccountAuth({
              client_email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
              private_key: config.GOOGLE_PRIVATE_KEY,
            });
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            await sheet.loadCells("A1:B5");
            const checkCell = sheet.getCellByA1(checkType);
            checkCell.value = "TRUE";
            await sheet.saveUpdatedCells();
            client.channels.cache
              .get(channelId)
              .send(
                `@here ${
                  bankType == "MAD" ? "MAD" : "UNC"
                } bank bubble is going to expire in less than 3 hours. Please apply new bubble asap!`
              );
          })();
        }
      }
    };
    setInterval(() => {
      (async () => {
        const doc = new GoogleSpreadsheet(config.TIME_STORE_SPREADSHEET_ID);
        await doc.useServiceAccountAuth({
          client_email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: config.GOOGLE_PRIVATE_KEY,
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        await sheet.loadCells("A1:B5");

        const d = new Date();
        const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        const time = `${d.getHours()}:${d.getMinutes()}`;
        const currentDateTime = date + " " + time;

        const UNC_DURATION = sheet.getCellByA1("B2").value;
        const MAD_DURATION = sheet.getCellByA1("B3").value;
        const UNC_CHECK = sheet.getCellByA1("B4").value;
        const MAD_CHECK = sheet.getCellByA1("B5").value;

        checkIfTimeNearEnd(
          MAD_DURATION,
          MAD_CHECK,
          currentDateTime,
          client,
          channelId,
          "MAD"
        );

        checkIfTimeNearEnd(
          UNC_DURATION,
          UNC_CHECK,
          currentDateTime,
          client,
          channelId,
          "UNC"
        );
      })();
      // Checks if function setInterval is working
      console.log("Bubble bot is running");
    }, 60000);
  }
});

if (settings.INTRODUCTION_CHANNEL) {
  client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name === settings.INTRODUCTION_CHANNEL
    );
    channel.send(
      `Hey ${member.toString()}, welcome to K40 Discord :tada::hugging: ! Please change your name to the character in game with your Alliance tag in front. Example : [ABC] JohnDoe`
    );
  });
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", (message) => {
  const PREFIX1 = config.PREFIX1;
  // For commands that starts with tag i.e. @Role
  if (message.content.startsWith("<") && !message.author.bot) {
    /**
     * Get role details
     * @param id
     * @returns role obj
     */
    const getRoleDetails = (id) => {
      return message.guild.roles.cache.find((data) => {
        return data.id == id;
      });
    };

    // Parse tag to get only the id
    const parseIdTag = (tag) => {
      if (!tag) {
        return false;
      }

      const numberPattern = /\d+/g;
      return tag.match(numberPattern).join("");
    };

    const msgContent = message.content.split(" ");
    const protocolOfficer = getRoleDetails(parseIdTag(msgContent[0]));

    // Check for the channel access
    if (message.channel.name != settings.BUFF_CHANNEL) {
      return false;
    }

    // Check if Protocol Officer is used as first tag
    if (protocolOfficer && protocolOfficer.name != settings.PO_ROLE) {
      return false;
    }

    let role = (function () {
      let index = msgContent.findIndex((elem) => {
        return !elem.startsWith("<");
      });

      if (index == -1) {
        return parseIdTag(msgContent[msgContent.length - 1]);
      }

      return parseIdTag(msgContent[index - 1]);
    })();

    role = getRoleDetails(role);
    let roleLowerCased;

    if (role) {
      roleLowerCased = role.name.toLowerCase();
    }

    if (role && msgContent.length >= 2) {
      // Commands using roles, has @ identifier
      const titleCommands = [
        "research",
        "gather",
        "training",
        "building",
        "atk",
      ];

      if (titleCommands.includes(roleLowerCased)) {
        client.commands.get(roleLowerCased).execute(message);
        return true;
      } else {
        message.channel.send("Command not found!");
        return;
      }
    }
  }

  // For commands that starts with prefix
  if (message.content.startsWith(PREFIX1)) {
    commandHandler(client, message, PREFIX1);
    return;
  }
});

client.login(config.TOKEN);
