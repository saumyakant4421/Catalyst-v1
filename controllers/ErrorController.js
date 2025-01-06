const ErrorData = require("../json/error.json");

const accountExists = (req, res) => {
  res.render("error", { error: ErrorData.accountExists });
};

const accountAbsent = (req, res) => {
  res.render("error", { error: ErrorData.accountAbsent }); 
};

const accountInvalid = (req, res) => {
  res.render("error", { error: ErrorData.accountInvalid });
};

const accountCreationFailure = (req, res) => {
  res.render("error", { error: ErrorData.accountCreationFailure });
};

const loginPasswordIncorrect = (req, res) => {
  res.render("error", { error: ErrorData.loginPasswordIncorrect });
};

const loginPasswordMismatch = (req, res) => {
  res.render("error", { error: ErrorData.loginPasswordMismatch });
};

module.exports = {
  accountExists,
  accountAbsent,
  accountInvalid,
  accountCreationFailure,
  loginPasswordIncorrect,
  loginPasswordMismatch,
};
