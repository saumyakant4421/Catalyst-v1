const { Account } = require("../database/models/AccountModel.js");

const optionalAuthentication = async (req, res, next) => {
    try {
        if (req.session.userId) {
            // Fetch user details if not already in session
            if (!req.session.account) {
                const account = await Account.findById(req.session.userId);
                if (!account) {
                    req.session.destroy(); // Destroy invalid session
                    return next(); // Proceed as unauthenticated
                }
                req.session.account = account; // Save user details in session
            }

            // Attach user details to the request object
            req.user = req.session.account;
        }

        // Proceed to the next middleware
        next();
    } catch (err) {
        console.error("Optional authentication error:", err.message);
        next(); // Allow access as unauthenticated in case of errors
    }
};

module.exports = { optionalAuthentication };
