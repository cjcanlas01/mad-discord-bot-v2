const config = require("../common/getConfig")();

module.exports = {
  name: "setup-poroles",
  description: "Setup PO roles.",
  syntax: `${config.PREFIX1}setup-poroles`,
  po: true,
  execute(message) {
    // Check if command executor has admin privileges
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("You must be an admin to execute this command.");
      return false;
    }

    const poRoles = [
      {
        name: "PO",
        color: "GREEN",
      },
      {
        name: "Protocol Officer",
        color: "GREEN",
      },
      {
        name: "Gather",
        color: "BLUE",
      },
      {
        name: "Building",
        color: "BLUE",
      },
      {
        name: "Research",
        color: "BLUE",
      },
      {
        name: "Training",
        color: "BLUE",
      },
      {
        name: "ATK",
        color: "BLUE",
      },
    ];

    const getRole = (roleString) => {
      // Find discord role object
      let role = message.guild.roles.cache.find((data) => {
        return data.name == roleString;
      });
      return role;
    };

    const isRolesCreated = poRoles.every((el) => {
      return getRole(el.name);
    });

    // Check if all roles has been created
    if (isRolesCreated) {
      message.channel.send("PO roles is already created.");
      return false;
    }

    let rolesCreated = [];
    let rolesNotCreated = [];
    for (let i = 0; i < poRoles.length; i++) {
      if (!getRole(poRoles[i]["name"])) {
        message.guild.roles.create({
          data: {
            name: poRoles[i]["name"],
            color: poRoles[i]["color"],
          },
        });
        rolesCreated.push(poRoles[i]["name"]);
      } else {
        rolesNotCreated.push(poRoles[i]["name"]);
      }
    }

    message.channel.send(
      `Roles created: ${rolesCreated.join(
        ", "
      )} and following roles are not to avoid duplication: ${
        rolesNotCreated.join(", ") || "none"
      }.`
    );
  },
};
