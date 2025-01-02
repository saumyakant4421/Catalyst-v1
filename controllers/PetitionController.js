const HomeData = require("../json/home.json"); // Ensure this path is correct
const { Petition, Account } = require("../database/models/AccountModel.js");
const { bucket } = require("../firebase"); // Firebase bucket for storage

exports.startPetition = (req, res) => {
    const categories = HomeData.templates;
    const icons = HomeData.icons;

    res.render('creation', {
        templates: categories,
        icons: icons,
        user: req.session.account
    });
};

exports.createPetition = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            petition_to,
            petition_by,
            petition_date,
            location,
            targetSupporters,
        } = req.body;

        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).render('creation/error', {
                errorMessage: "Unauthorized: Please log in to create a petition.",
            });
        }

        // Validate required fields
        if (!title || !description || !category || !petition_to || !petition_by || !petition_date || !location || !targetSupporters) {
            return res.status(400).send("All fields are required.");
        }

        const petitionToArray = petition_to
        .split(",")            // Split the string by commas
        .map(entity => entity.trim());  // Trim spaces around each entity

        // Default image URL
        let imageUrl = "";

        // Handle image upload if file exists
        if (req.file) {
            const file = bucket.file(`petitions/${Date.now()}_${req.file.originalname}`);
            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            // This is now wrapped in a promise to wait for the finish event before continuing
            await new Promise((resolve, reject) => {
                stream.on('error', (err) => {
                    reject(new Error("Image upload failed."));
                });

                stream.on('finish', async () => {
                    try {
                        await file.makePublic();
                        imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                        resolve();
                    } catch (err) {
                        reject(new Error("Error making image public."));
                    }
                });

                stream.end(req.file.buffer);
            });
        }

        // Prepare the new petition object
        const newPetition = {
            title,
            description,
            location,
            category: Array.isArray(category) ? category : [category],
            scope: req.body.scope || "Local",
            authors: [petition_by],
            targetEntities: petitionToArray,  
            createdAt: new Date(),
            targetSupporters: targetSupporters,
            targetDate: petition_date,
            creatorId: req.session.userId,
            supporters: [],
            image: imageUrl, // Set image URL
            verified: 'N',
        };

        // Save petition to database
        const petition = new Petition(newPetition);
        await petition.save();

        // Link petition to creator's account
        await Account.findByIdAndUpdate(
            req.session.userId,
            { $push: { createdPetitions: petition._id } }
        );

        return res.render('creation/success', {
            message: "Your petition has been created successfully!",
            petitionId: petition._id
        });


    } catch (err) {
        console.error("Error occurred:", err.message);
        // Render error view with message using the correct path
        return res.render('creation/error', {
            errorMessage: err.message || "An unexpected error occurred while creating your petition."
        });
    }
};
