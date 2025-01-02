const express = require("express");
const router = express.Router();
const { getPetitionById, signPetition } = require("../controllers/DetailsController.js");
const { optionalAuthentication } = require("../middlewares/authMiddleware.js");

// Route to fetch petition details (authentication optional)
router.get("/:id", optionalAuthentication, getPetitionById);

// Route to sign a petition (requires authentication)
router.post("/:id/sign", optionalAuthentication, signPetition);

module.exports = router;
