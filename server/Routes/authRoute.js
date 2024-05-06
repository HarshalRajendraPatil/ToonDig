// Requiring all the important packages
const express = require("express");

// Requiring all the important modules
const authController = require("./../Controllers/authController");
const middleware = require("./../Middlewares/middleware");

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

// Route for GET request on "/forgot-password" link
router.get("/forgot-password", authController.getForgotPassword);

// Route for POST request on "/forgot-password" link
router.post("/forgot-password", authController.postForgotPassword);

// Route for GET request on "/reset-password" link
router.get("/reset-password", authController.getResetPassword);

// Route for POST request on "/reset-password" link
router.post("/reset-password", authController.postResetPassword);

// Route for GET request on "/logout" link
router.get("/logout", middleware.isLoggedIn, authController.getLogout);

// Exporting the router
module.exports = router;
