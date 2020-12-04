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
     * Market transport tax value for using request calculator command
     */
    TRANSPORT_TAX: "7",
    /**
     * Market transport amount value for using request calculator command
     */
    MAX_TRANSPORT_AMOUNT: "6760000",
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
      "K31 Discord": {
        tag: "K31",
        name: "Official K53 Discord",
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
      guild: "Dominator's Touch",
      channel: "bigmad-channel",
      cellsCovered: "A1:C6",
      TIME_STORE: [
        {
          name: "BBLUVSYOU",
          durationAndRenewedCell: ["B2", "C2"],
        },
        {
          name: "IRONBANK",
          durationAndRenewedCell: ["B3", "C3"],
        },
        {
          name: "QCOLDWATER",
          durationAndRenewedCell: ["B4", "C4"],
        },
        {
          name: "CHETMANLEY",
          durationAndRenewedCell: ["B5", "C5"],
        },
        {
          name: "AKUMAJAYPEE",
          durationAndRenewedCell: ["B6", "C6"],
        },
      ],
    },
    ACTIVATE: {
      BUBBLE_REMINDER: true,
      QUEUEING_SYSTEM: true,
    },
  };
};

module.exports = {
  getSettings,
};
