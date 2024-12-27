const express = require("express");
const { login } = require("../Controllers/auth");

const router = express.Router();

// Login route
router.post("/login", login);

module.exports = router;
