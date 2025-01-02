require("dotenv").config();

const express = require("express");
const bodyparser = require("body-parser");
const session = require("express-session");
const memoryStore = require("memorystore")(session);
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const path = require("path"); // Ensure path is imported

const app = express();

const { ConnectDatabase } = require("./database/DatabaseManager.js");

// LiveReload setup for development
global.liveReloadServer = livereload.createServer();
liveReloadServer.watch([
    path.join(__dirname), // Watch the root directory
    path.join(__dirname, 'css'),  // Watch the 'css' directory
    path.join(__dirname, 'js'),   // Watch the 'js' directory
    path.join(__dirname, 'assets') // Watch the 'assets' directory, if any
]);

// Notify the browser of changes
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Add livereload middleware
app.use(connectLivereload());

// Error handler route
// To be configured based on actual requirements

// Importing route files
const homeRoute = require("./routes/home.js");
const accountRoute = require("./routes/account.js");
const errorRoute = require("./routes/error.js");
const petitionRoute = require("./routes/petition.js");
const listingRoute = require("./routes/listing.js");
const detailsRoute = require("./routes/details.js");
const myListingsRoute = require("./routes/myListings.js");

// const authRoute = require("./routes/auth.js");

// Middleware for parsing request bodies
app.use(bodyparser.urlencoded({ extended: true }));  // Corrected the extended type

// Session configuration
app.use(
    session({
        secret: "Catalyst", // Replace with a secure value in production
        cookie: {
            secure: false, // Should be true in production when using HTTPS
            maxAge: 86400000, // 24 hours
        },
        store: new memoryStore({
            checkPeriod: 86400000, // Clean up expired sessions every 24 hours
        }),
        saveUninitialized: false,
        resave: false,
    })
);

// Serve static files from specific directories
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'json')));
app.use(express.static(path.join(__dirname, 'javascript')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));


// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
// Establish MongoDB connection
ConnectDatabase();

// Use imported routes
app.use("/", homeRoute);
app.use("/account", accountRoute);
app.use("/error", errorRoute);
app.use("/petition", petitionRoute);
app.use("/", listingRoute);
app.use("/petition", detailsRoute);
app.use("/", myListingsRoute); 
// Uncomment routes when needed

// Fallback for invalid routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start the server
app.listen(process.env.DEVELOPMENT_PORT || process.env.PORT, () => {
    console.log(`PORT: ${process.env.DEVELOPMENT_PORT || process.env.PORT} | ACTIVE`);
});
