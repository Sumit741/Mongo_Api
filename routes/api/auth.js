const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authController");

router.post("/", authControllers.handleLogin);

module.exports = router;
