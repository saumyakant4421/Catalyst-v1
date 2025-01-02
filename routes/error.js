const express = require("express");
const router = express.Router();
const ErrorData = require("../json/error.json");

// Map error messages to corresponding keys in the JSON
const errorMapping = {
    "Account already exists": "accountExists",
    "Account not found": "accountAbsent",
    "Invalid account details": "accountInvalid",
    "Account creation failed": "accountCreationFailure",
    "Incorrect password": "loginPasswordIncorrect",
    "Password mismatch": "loginPasswordMismatch",
    "Invalid email or password": "loginPasswordIncorrect", 
    // Add more mappings as needed
};

// Dynamic route to handle errors based on query string
router.get("/", (req, res) => {
    const message = req.query.message;

    if (message && errorMapping[message]) {
        const errorKey = errorMapping[message];
        const errorData = ErrorData[errorKey];
        
        if (errorData) {
            return res.render("error", { error: errorData });
        }
    }

    // Fallback for unknown errors
    res.render("error", { error: { 
        title: "Unknown Error", 
        description: "An unexpected error occurred. Please try again later.", 
        image: "/path/to/default-error-image.png" 
    }});
});

module.exports = router;
