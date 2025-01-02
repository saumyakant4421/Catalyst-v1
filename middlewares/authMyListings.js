const mongoose = require("mongoose"); // Use for Mongoose ObjectId

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            req.user = {
                _id: new mongoose.Types.ObjectId(req.session.userId), // Ensure valid ObjectId
                username: req.session.username,
                email: req.session.email,
            };
            return next();
        } catch (err) {
            console.error("Error converting session userId to ObjectId:", err.message);
            return res.redirect("/#account-section"); // Redirect on invalid ObjectId
        }
    }
    res.redirect("/#account-section"); // Redirect if not authenticated
};
