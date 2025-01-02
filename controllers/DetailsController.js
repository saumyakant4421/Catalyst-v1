const { Petition, Account } = require("../database/models/AccountModel.js");
const HomeData = require("../json/home.json");

/**
 * Get a petition by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPetitionById = async (req, res) => {
    try {
        const petitionId = req.params.id;

        if (!petitionId) {
            return res.status(400).render("creation/error", {
                errorMessage: "Invalid Petition ID",
            });
        }

        // Fetch petition details
        const petition = await Petition.findById(petitionId).populate("supporters.userId", "username email");
        if (!petition) {
            return res.status(404).render("creation/error", {
                errorMessage: "Petition not found",
            });
        }

        // Update petition status based on conditions
        const totalSupporters = petition.supporters.length;
        const currentDate = new Date();
        let statusUpdated = false;

        // Check if target supporters reached
        if (totalSupporters >= petition.targetSupporters && petition.status !== "success") {
            petition.status = "success";
            statusUpdated = true;
        }
        
        // Check if target date passed
        if (petition.targetDate && new Date(petition.targetDate) < currentDate && petition.status !== "success") {
            petition.status = "closed";
            statusUpdated = true;
        }

        // Save if status was updated
        if (statusUpdated) {
            await petition.save();
        }

        // Calculate progress
        const progress = ((totalSupporters / petition.targetSupporters) * 100).toFixed(2);

        // Fetch category details for UI
        const categories = HomeData.templates;
        const icon = HomeData.templates.icon;

        // Render the details page
        res.render("details", {
            petition,
            progress,
            totalSupporters,
            targetSupporters: petition.targetSupporters,
            user: req.session.account || null,
            templates: categories,
            dataSupporters: totalSupporters,
            dataTargetSupporters: petition.targetSupporters,
            icon: icon,
        });
    } catch (err) {
        console.error("Error fetching petition by ID:", err.message);
        res.status(500).render("creation/error", {
            errorMessage: "An error occurred while fetching the petition.",
        });
    }
};

/**
 * Sign a petition
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signPetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.session.userId;

        // Ensure the user is logged in
        if (!userId) {
            return res.status(401).render("creation/error");
        }

        // Fetch the petition
        const petition = await Petition.findById(petitionId);
        if (!petition) {
            return res.status(404).json({ error: "Petition not found." });
        }

        // Check if petition is closed or successful
        if (petition.status === "closed") {
            return res.status(400).json({ message: "This petition is closed and no longer accepting signatures." });
        }

        // Check if the user has already signed the petition
        const alreadySigned = petition.supporters.some(supporter => supporter.userId.toString() === userId);
        if (alreadySigned) {
            return res.status(400).json({ message: "You have already signed this petition." });
        }

        // Add the user to the supporters list
        petition.supporters.push({ userId, signedAt: new Date() });

        // Check if this signature meets the target
        if (petition.supporters.length >= petition.targetSupporters) {
            petition.status = "success";
        }

        await petition.save();

        // Update the user's signed petitions list
        await Account.findByIdAndUpdate(userId, { $push: { signedPetitions: petitionId } });

        res.status(200).json({ 
            message: "Thank you for signing the petition!",
            status: petition.status // Return updated status
        });
    } catch (err) {
        console.error("Error signing petition:", err.message);
        res.status(500).json({ error: "An error occurred while signing the petition." });
    }
};

module.exports = {
    getPetitionById,
    signPetition,
};