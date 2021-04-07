const getSettings = () => {
  return {
    /**
     * Discord server role used by bot to indicate if person has access to Protocol Officer
     */
    PO_ACCESS_ROLE: "poaccess",
    /**
     * Discord server role to identify person who is currently managing Protocol Officer related tasks
     */
    PO_ROLE: "Protocol Officer",
    /**
     * Discord server role to check for rally leaders permissions
     */
    RALLY_LEADER_ROLE: "Rally Leader",
    /**
     * Discord server text channel to display title queue
     */
    QUEUE_CHANNEL: "title-queue",
    /**
     * Discord server text channel where title requests is received
     */
    BUFF_CHANNEL: "buff-requests",
    /**
     * Storage for transport details for banks
     */
    BANK: {
      IRONBANK: {
        TRANSPORT_TAX: "7",
        TRANSPORT_AMOUNT: "6760000",
      },
      BBLUVSYOU: {
        TRANSPORT_TAX: "7.2",
        TRANSPORT_AMOUNT: "4260000",
      },
    },
    /**
     * Discord server role for ...
     */
    BANK_ROLE: "Bank",
    /**
     * Discord server channel to display bubble notifications
     */
    MANAGEMENT_CHANNEL: "bigmad-channel",
    /**
     * Discord server role for
     * sister alliance of main alliance
     */
    SISTER_ALLIANCE_ROLE: "MaD Member",
    /**
     * Welcome channel object to be used for setting up greetings messages for multiple servers
     * Syntax:
     * [Discord server name]
     * - tag (three letters)
     * - discord server name
     * - discord server welcome channel
     * - discord server rules channel (optional)
     */
    WELCOME_CHANNEL: {
      "K65 Discord": {
        tag: "K65",
        name: "K65 Discord",
        welcomeChannel: "welcome",
        rulesChannel: "",
      },
      "MAD - Mass Destruction": {
        tag: "MAD",
        name: "MAD - Mass Destruction",
        welcomeChannel: "welcome",
        rulesChannel: "",
      },
    },
    BUBBLE: {
      channel: "bigmad-channel",
      cellsCovered: "A1:C3",
      TIME_STORE: [
        {
          name: "BB",
          durationAndRenewedCell: ["B2", "C2"],
        },
        {
          name: "Iron",
          durationAndRenewedCell: ["B3", "C3"],
        },
      ],
    },
    /**
     * WIP: add this boolean conditions
     * for setting commands by category
     * for easy activation
     */
    ACTIVATE: {
      BUBBLE_REMINDER: true,
      QUEUEING_SYSTEM: true,
    },
  };
};

module.exports = {
  getSettings,
};
