// Requiring all the important packages
const express = require("express");

// Requiring all the important modules
const userController = require("./../../Controllers/userController");
const middleware = require("./../../Middlewares/middleware");

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for GET request "/api/getAllUsers" URL to get all the users
router.get(
  "/user/getAllUsers",
  middleware.isLoggedIn,
  middleware.isAdmin,
  userController.getAllUsers
);

// Route for GET request "/api/user/profile" URL to get a single user
router.get("/user/profile", middleware.isLoggedIn, userController.getUser);

// Route for PUT request "/api/user/profile" URL to update a single user
router.put("/user/profile", middleware.isLoggedIn, userController.updateUser);

// Route for DELETE request "/api/user/delete-account" URL to delete a single user
router.delete(
  "/user/delete-account",
  middleware.isLoggedIn,
  userController.deleteUser
);

// Route for POST request "/api/user/change-password" URL to update the password
router.post(
  "/user/change-password",
  middleware.isLoggedIn,
  userController.changePassword
);

// Exporting the router
module.exports = router;
