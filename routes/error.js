const express = require("express");
const router = express.Router();
const ErrorData = require("../json/error.json");
const errorController = require("../controllers/ErrorController.js");


// Dynamic route for specific error types
router.get("/:errorType", (req, res) => {
    const { errorType } = req.params;
    
    if (errorType && ErrorData[errorType]) {
        return res.render("error", { error: ErrorData[errorType] });
    }
    
    // Fallback for unknown errors
    res.render("error", { error: { 
        title: "Unknown Error", 
        description: "An unexpected error occurred. Please try again later.", 
        image: "/error/general.png" 
    }});
});

// Maintain compatibility with query parameter approach
router.get("/", (req, res) => {
    const message = req.query.message;
    const errorType = getErrorType(message);
    
    if (ErrorData[errorType]) {
        return res.render("error", { error: ErrorData[errorType] });
    }
    
    // Fallback for unknown errors
    res.render("error", { error: { 
        title: "Unknown Error", 
        description: "An unexpected error occurred. Please try again later.", 
        image: "/error/general.png" 
    }});
});


module.exports = router;
