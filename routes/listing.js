const express = require('express');
const router = express.Router();
const { getPetitionsByCategory } = require('../controllers/ListingController');

router.get('/listing/:category', getPetitionsByCategory);

module.exports = router;
