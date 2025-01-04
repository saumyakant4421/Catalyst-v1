const { Petition, Account } = require("../database/models/AccountModel.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose"); // For ObjectId


exports.getMyListings = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id); // Ensure ObjectId

        // Fetch created petitions
        const createdPetitions = await Petition.find({ creatorId: userId });

        // Fetch signed petitions
        const signedPetitions = await Petition.find({ "supporters.userId": userId });

        const category = "General"; // Adjust as needed or fetch dynamically

        res.render("myListings", {
            user: req.user,
            createdPetitions,
            signedPetitions,
            category,
        });
    } catch (err) {
        console.error("Error loading my listings:", err.message);
        res.render("error", {
            error: {
                title: "Unable to Load Listings",
                description: "An error occurred while loading your listings. Please try again later.",
                image: "/assets/error.png",
            },
        });
    }
};



exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).send("Both current and new passwords are required.");
        }

        const user = await Account.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).render("error", { error: {
                title: "Password Mismatch",
                description: "The current password is incorrect.",
                image: "/assets/error.png"
            }});
        }

        // Update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.render("success", { 
            message: "Password changed successfully." 
        });
    } catch (err) {
        console.error("Error changing password:", err.message);
        res.render("error", { error: {
            title: "Unable to Change Password",
            description: "An unexpected error occurred while changing your password.",
            image: "/assets/error.png"
        }});
    }
};

exports.logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error("Error during logout:", err.message);
                return res.render("error", { error: {
                    title: "Logout Failed",
                    description: "An error occurred during logout. Please try again.",
                    image: "/assets/error.png"
                }});
            }
            res.redirect("/#account-section");
        });
    } catch (err) {
        console.error("Error during logout:", err.message);
        res.render("error", { error: {
            title: "Logout Error",
            description: "An unexpected error occurred. Please try again later.",
            image: "/assets/error.png"
        }});
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        // Remove user's account
        await Account.findByIdAndDelete(req.user._id);
        
        // Remove petitions created by the user
        await Petition.deleteMany({ creatorId: req.user._id });

        // Destroy session and wait for completion
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err.message);
                return res.render("creation/error", { 
                    error: {
                        title: "Session Termination Failed",
                        description: "Account deleted but session cleanup failed. Please clear your browser cache.",
                        image: "/assets/error.png"
                    }
                });
            }
            
            // Clear session cookie
            res.clearCookie('connect.sid');
            
            // Redirect with cache control headers
            res.set({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.redirect('/');
        });

    } catch (err) {
        console.error("Error deleting account:", err.message);
        res.render("creation/error", { 
            error: {
                title: "Account Deletion Failed",
                description: "An unexpected error occurred while deleting your account. Please try again later.",
                image: "/assets/error.png"
            }
        });
    }
};

exports.deletePetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.user._id;

        // Find and ensure the petition belongs to the user
        const petition = await Petition.findOne({ _id: petitionId, creatorId: userId });
        
        if (!petition) {
            return res.status(404).json({ 
                success: false, 
                message: "Petition not found or unauthorized" 
            });
        }

        await Petition.findByIdAndDelete(petitionId);
        
        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting petition:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while deleting the petition" 
        });
    }
};
