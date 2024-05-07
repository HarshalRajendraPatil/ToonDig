// Requiring all the important packages
import express from "express";

// Requiring all the important modules
import authController from "./../Controllers/authController.js";
import middleware from "../Middlewares/middleware.js";

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for POST request "/register" link
router.post("/register", authController.postRegisterPage);

// Route for POST request on "/login" link
router.post("/login", authController.postLoginPage);

// Route for POST request on "/forgot-password" link
router.post("/forgot-password", authController.postForgotPassword);

// Route for POST request on "/reset-password" link
router.post("/reset-password", authController.postResetPassword);

// Route for GET request on "/logout" link
router.post("/logout", middleware.isLoggedIn, authController.postLogout);

// Exporting the router
export default router;
