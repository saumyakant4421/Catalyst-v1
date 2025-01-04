const express = require("express");
const { isAuthenticated } = require("../middlewares/authMyListings.js");
const {
    getMyListings,
    changePassword,
    logout,
    deleteAccount,
    deletePetition,
} = require("../controllers/myListingsController.js");

const router = express.Router();

router.get("/myListings", isAuthenticated, getMyListings);

router.post("/changePassword", isAuthenticated, changePassword);

router.post("/logout", isAuthenticated, logout);

router.post("/deleteAccount", isAuthenticated, deleteAccount);

router.post("/petition/:id/delete", isAuthenticated, deletePetition);

module.exports = router;
