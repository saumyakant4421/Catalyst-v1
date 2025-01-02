const {Account} = require("../models/AccountModel.js");
const bcrypt = require("bcrypt");

module.exports.DatabaseCreateAccount = async (credentials, request) => {
  try {
    // Validate inputs (e.g., email format, password strength, etc.)
    if (!credentials.email || !credentials.password || !credentials.username) {
      return { success: false, message: "Invalid input data" };
    }

    // Check if an account with the email already exists
    const databaseAccount = await Account.findOne({ email: credentials.email });
    if (databaseAccount) {
      return { success: false, message: "Account already exists" };
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(credentials.password, 10);

    // Create and save the new account
    const account = new Account({
      username: credentials.username,
      email: credentials.email,
      password: encryptedPassword,
      signedPetitions: [],
    });

    const createdAccount = await account.save();

    if (!createdAccount) {
      return { success: false, message: "Failed to create account" };
    }

    // Set session data
    request.session.username = createdAccount.username;
    request.session.email = createdAccount.email;

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    console.error("Error during account creation:", error);
    return { success: false, message: "Internal server error" };
  }
};
