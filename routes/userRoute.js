const express = require("express");
const router = express.Router();
// authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// user controllers

const { register, login, checkUser } = require("../controller/userController");

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Check user route
router.get("/check", authMiddleware, checkUser);

module.exports = router;
