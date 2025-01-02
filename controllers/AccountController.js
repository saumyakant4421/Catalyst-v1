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
    res.redirect(`/error?message=${encodeURIComponent(result.message)}`);
  }
};

const login = async (req, res) => {
  const result = await AccountManager.LoginAccount(req.body, req);
  if (result.success) {
    res.redirect("/");
  } else {
    res.redirect(`/error?message=${encodeURIComponent(result.message)}`);
  }
};

module.exports = {
  create,
  login,
};
