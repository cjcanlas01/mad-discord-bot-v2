const getSettings = () => {
  return {
    BUBBLE: {
      channel: "main-alliance",
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
  };
};

module.exports = {
  getSettings,
};
