const fs = require("fs");
const Discord = require("discord.js");
const config = require("./common/getConfig")();
const settings = require("./settings.json");
const client = new Discord.Client();
const { commandHandler } = require("./common/trackingSystem");
const { readJson, writeJson } = require("./common/utilities");

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity(`${config.PREFIX1}madhelp`, { type: "LISTENING" });

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
    const dateEnd = `${dE.getFullYear()}-${dE.getMonth() + 1}-${dE.getDate()}`;
    const timeEnd = `${dE.getHours()}:${dE.getMinutes()}`;

    return [dateStart + " " + timeStart, dateEnd + " " + timeEnd];
  };

  const checkIfTimeNearEnd = (
    duration,
    check,
    currentDateTime,
    client,
    bankType,
    fileName,
    fileData
  ) => {
    if (duration && !check) {
      duration = getDateDurations(duration);
      if (currentDateTime >= duration[0] && currentDateTime <= duration[1]) {
        if (bankType == "MAD") {
          fileData["MAD-CHECK"] = true;
        } else {
          fileData["UNC-CHECK"] = true;
        }
        writeJson(fileName, fileData).then((data) => {
          if (data == "File update success!") {
            client.channels.cache
              .get(channelId)
              .send(
                `@here ${
                  bankType == "MAD" ? "MAD" : "UNC"
                } bank bubble is going to expire in less than 3 hours. Please apply new bubble asap!`
              );
          }
        });
      }
    }
  };

  const d = new Date();
  const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const time = `${d.getHours()}:${d.getMinutes()}`;
  const currentDateTime = date + " " + time;

  setInterval(() => {
    const fileName = "./data/time-store.json";
    readJson(fileName).then((data) => {
      let MAD_DURATION = data["MAD-BANK"];
      let UNC_DURATION = data["UNC-BANK"];
      const MAD_CHECK = data["MAD-CHECK"];
      const UNC_CHECK = data["UNC-CHECK"];

      checkIfTimeNearEnd(
        MAD_DURATION,
        MAD_CHECK,
        currentDateTime,
        client,
        "MAD",
        fileName,
        data
      );

      checkIfTimeNearEnd(
        UNC_DURATION,
        UNC_CHECK,
        currentDateTime,
        client,
        "UNC",
        fileName,
        data
      );
    });

    // Checks if function setInterval is working
    console.log("Bubble bot is running");
  }, 10000);
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
        console.log([client.commands, roleLowerCased]);
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
