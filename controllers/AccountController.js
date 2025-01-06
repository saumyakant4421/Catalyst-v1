const AccountManager = require("../database/AccountManager.js");

const create = async (req, res) => {
  const result = await AccountManager.CreateAccount(req.body, req);
  if (result.success) {
    // Clear any existing session data
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      // Redirect to home page with account section visible
      res.redirect('/#account-section');
    });
  } else {
    const errorType = getErrorType(result.message);
    res.redirect(`/error/${errorType}`);
  }
}; 

const login = async (req, res) => {
  const result = await AccountManager.LoginAccount(req.body, req);
  if (result.success) {
    res.redirect("/");
  } else {
    const errorType = getErrorType(result.message);
    res.redirect(`/error/${errorType}`);  }
};

// Helper function to map error messages to error types
const getErrorType = (message) => {
  const errorMap = {
    "Account already exists": "accountExists",
    "Account not found": "accountAbsent",
    "Invalid account details": "accountInvalid",
    "Failed to create account": "accountCreationFailure",
    "Invalid email or password": "loginPasswordIncorrect",
    "Password mismatch": "loginPasswordMismatch",
    "Internal server error": "accountCreationFailure"
  };
  return errorMap[message] || "unknown";
};


module.exports = {
  create,
  login,
};
