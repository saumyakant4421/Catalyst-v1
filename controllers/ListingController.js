const { Petition } = require("../database/models/AccountModel.js");

/**  Middleware to check if the user is logged in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/#account-section'); // Redirect to login page if not logged in
    }
    next();
};

/**
 * Controller to get petitions by category and sort order
 * Handles both JSON responses for AJAX requests and EJS rendering for full-page responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPetitionsByCategory = async (req, res) => {
    try {
        const category = req.query.category || req.params.category || null;
        const sort = req.query.sort || "newest";

        if (!category && req.xhr) {
            return res.status(200).json({ petitions: [] });
        }

        const validCategories = ['Environment', 'Economic Justice', "Women's Rights", 'Education', 'Disability', 'Sports', 'Entertainment and Media', 'Digital Rights'];
        const sanitizedCategory = category ? category : null;

        if (sanitizedCategory && !validCategories.includes(sanitizedCategory)) {
            return res.status(400).json({ error: "Invalid category" });
        }

        let sortQuery = {};
        switch (sort) {
            case "newest":
                sortQuery = { createdAt: -1 };
                break;
            case "oldest":
                sortQuery = { createdAt: 1 };
                break;
            case "supporters":
                sortQuery = { supportersCount: -1 };
                break;
            default:
                sortQuery = { createdAt: -1 };
        }

        const petitions = sanitizedCategory
            ? await Petition.aggregate([
                { $match: { category: sanitizedCategory } },
                { $addFields: { supportersCount: { $size: "$supporters" } } },
                { $sort: sortQuery },
            ])
            : [];

        if (req.xhr) {
            return res.status(200).json({ petitions });
        }

        res.render("listing", {
            petitions,
            category: sanitizedCategory,
            sort,
            user: req.session.account || null,
        });
    } catch (err) {
        console.error("Error fetching petitions by category:", err.message);

        if (req.xhr) {
            return res.status(500).json({ error: "Failed to fetch petitions." });
        }

        res.status(500).render("creation/error", {
            errorMessage: "An error occurred while fetching petitions.",
        });
    }
};

module.exports = {
    isAuthenticated,
    getPetitionsByCategory,
};