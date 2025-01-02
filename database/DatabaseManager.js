require("dotenv").config();
const mongoose = require("mongoose");

module.exports.ConnectDatabase = async () => {
    try {
        await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DATABASE}`,
            {
                ssl: true,
                // sslValidate: true,  // Disable SSL certificate validation for testing
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
                
                retryReads: true,
                retryWrites: true,
            }
        );
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};
