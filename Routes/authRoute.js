// Requiring all the important packages
const express = require("express");

// Requiring all the important modules
const authController = require("./../Controllers/authController");

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for GET request "/register" link
router.get("/register", authController.getRegisterPage);

// Route for POST request "/register" link
router.post("/register", authController.postRegisterPage);

// Route for GET request on "/login" link
router.get("/login", authController.getLoginPage);

// Route for POST request on "/login" link
router.post("/login", authController.postLoginPage);

// Exporting the router
module.exports = router;
