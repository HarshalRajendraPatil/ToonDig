// Requiring all the important packages
const express = require("express");

// Requiring all the important modules
const userController = require("./../../Controllers/userController");
const middleware = require("./../../Middlewares/middleware");

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for GET request "/api/getAllUsers" URL to get all the users
router.get(
  "/getAllUsers",
  middleware.isLoggedIn,
  middleware.isAdmin,
  userController.getAllUsers
);

// Route for GET request "/api/user/:id" URL to get a single user
router.get("/user/:id", middleware.isLoggedIn, userController.getUser);

// Route for PUT request "/api/user/:id" URL to update a single user
router.put("/user/:id", middleware.isLoggedIn, userController.updateUser);

// Route for DELETE request "/api/user/:id" URL to delete a single user
router.delete("/user/:id", middleware.isLoggedIn, userController.deleteUser);

// Exporting the router
module.exports = router;
