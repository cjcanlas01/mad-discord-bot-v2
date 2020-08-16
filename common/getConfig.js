require("dotenv").config();

module.exports = function getConfig() {
  return {
    PREFIX1: process.env.PREFIX1 || "!",
    TOKEN: process.env.BOT_TOKEN,
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    AVAILABLE: true,
    TIME_STORE_SPREADSHEET_ID: process.env.TIME_STORE_SPREADSHEET_ID,
  };
};
