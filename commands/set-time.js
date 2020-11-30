const config = require("../common/getConfig")();
const { getDateTime } = require("../common/utilities");
const { getSettings } = require("../config/settings");
const {
  initGoogleSpreadsheetConnection,
  getSheetCellVal,
} = require("../bootstrap/bubble");
const settings = getSettings();

/**
 * Prepare new datetime duration
 * for bubble reminder
 */
const prepareNewDuration = (durationInput) => {
  durationInput = durationInput.split("");
  const time = durationInput.pop();
  const duration = durationInput.join("");
  const d = new Date();

  if (Number.isInteger(Number(time))) {
    return false;
  }

  switch (time) {
    case "h":
      d.setHours(d.getHours() + Number(duration));
      break;
  }

  return getDateTime(d);
};

module.exports = {
  name: "set-time",
  description: "Set time for bubble reminders",
  syntax: `${config.PREFIX1}set-time [castle name] [duration]`,
  async execute(message) {
    /**
     * Restrict command execution
     * if not activated, can be found
     * in config/settings.js
     */
    if (!settings.ACTIVATE.BUBBLE_REMINDER) {
      return false;
    }

    const [, castleName, duration] = message.content.split(" ");

    /**
     * Checks for missing
     * argument input
     */
    if (!castleName && !duration) {
      message.channel.send("Missing arguments. Please try again.");
      return false;
    }

    /**
     * Check if castle name
     * exists on bubble setting
     */
    const checkIfCastleExists = settings.BUBBLE.TIME_STORE.find(
      (c) => c.name == castleName
    );

    if (!checkIfCastleExists) {
      message.channel.send(
        "Castle does not exists on any of my records... I'm sorry m'lord."
      );
      return false;
    }

    const castle = checkIfCastleExists;
    const datetime = prepareNewDuration(duration);

    const sheet = await initGoogleSpreadsheetConnection(
      config.TIME_STORE_SPREADSHEET_ID,
      config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      config.GOOGLE_PRIVATE_KEY
    );

    await sheet.loadCells(settings.BUBBLE.cellsCovered);
    const [durationFromCell, isRenewedFromCell] = castle.durationAndRenewedCell;
    /**
     * Get cell then apply new value
     */
    sheet.getCellByA1(durationFromCell).value = datetime;
    sheet.getCellByA1(isRenewedFromCell).value = "FALSE";
    await sheet.saveUpdatedCells();
    if (getSheetCellVal(sheet, isRenewedFromCell) == "FALSE") {
      message.channel.send(
        `New bubble duration for ${castle.name} is updated! Thank you.`
      );
    }
  },
};
