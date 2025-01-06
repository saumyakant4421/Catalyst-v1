const { Account } = require("../models/AccountModel.js");
const bcrypt = require("bcrypt");

module.exports.DatabaseLoginAccount = async (credentials, request) => {
  try {
    // Check if all required fields are provided
    if (!credentials.email || !credentials.password || !credentials.retypePassword) {
      return { success: false, message: "Invalid account details" };
    }

    // Check if password matches confirmPassword
    if (credentials.password !== credentials.retypePassword) {
      return { success: false, message: "Password mismatch" };
    }

    // Find the account using email
    const databaseAccount = await Account.findOne({ email: credentials.email });
    if (!databaseAccount) {
      return { success: false, message: "Account not found" };
    }

    // Compare hashed passwords
    const isValid = await bcrypt.compare(credentials.password, databaseAccount.password);
    if (!isValid) {
      return { success: false, message: "Invalid email or password" };
    }

    // Set session details on successful login
    request.session.userId = databaseAccount._id; 
    request.session.username = databaseAccount.username; 
    request.session.email = databaseAccount.email; 


    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "Internal server error" };
  }
};
