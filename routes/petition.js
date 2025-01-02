const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/PetitionController');

const multer = require('multer');
const path = require('path');

// Set up storage configuration for multer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true); // Accept the file
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

// Route: Render Start Petition Page
router.get('/start', petitionController.startPetition);

// Route: Render Creation Page
router.get('/creation', petitionController.startPetition);

// Route: Handle Petition Submission
router.post('/create', upload.single('image'), petitionController.createPetition);

// Success Page Route
router.get('/success', (req, res) => {
    res.render('creation/success', { 
        message: "Petition created successfully!" 
    });
});

// Error Page Route (Optional: fallback route)
router.get('/error', (req, res) => {
    res.render('creation/error', { 
        errorMessage: "An unexpected error occurred." 
    });
});

module.exports = router;
