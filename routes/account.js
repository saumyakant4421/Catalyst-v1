const express = require("express");
const router = express.Router();

const { create, login } = require("../controllers/AccountController.js");

router.post("/create", create);
router.post("/login", login);

module.exports = router;
