"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const configs = [
      {
        config: "PO_ACCESS_ROLE",
        value: "poaccess",
      },
      {
        config: "PO_ROLE",
        value: "Protocol Officer",
      },
      {
        config: "RALLY_LEADER_ROLE",
        value: "Rally Leader",
      },
      {
        config: "QUEUE_CHANNEL",
        value: "title-queue",
      },
      {
        config: "BUFF_CHANNEL",
        value: "buff-requests",
      },
      {
        config: "BANK_ROLE",
        value: "Bank",
      },
      {
        config: "MANAGEMENT_CHANNEL",
        value: "bigmad-channel",
      },
      {
        config: "SISTER_ALLIANCE_ROLE",
        value: "MaD Member",
      },
      {
        config: "BUFF_MODE",
        value: false,
      },
    ];

    return await queryInterface.bulkInsert("Configs", configs, {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Configs", null, {});
  },
};
