// Requiring all the important packages
const express = require("express");

// Requiring all the important modules
const videoController = require("./../../Controllers/videoController");
const middleware = require("./../../Middlewares/middleware");

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for GET request "/api/videos" URL to get all the videos
router.get("/videos", middleware.isLoggedIn, videoController.getAllVideos);

// Route for GET request "/api/videos/:id" URL to get a video based on id
router.get("/videos/:id", middleware.isLoggedIn, videoController.getVideo);

// Route for post request "/api/videos/upload" URL to upload a video
router.post(
  "/videos/upload",
  middleware.isLoggedIn,
  middleware.isAdmin,
  videoController.postVideo
);

// Route for put request "/api/videos/edit/:id" URL to edit a video
router.put(
  "/videos/edit/:id",
  middleware.isLoggedIn,
  middleware.isAdmin,
  videoController.editVideo
);

// Route for post request "/api/videos/delete/:id" URL to delete a video
router.delete(
  "/videos/delete/:id",
  middleware.isLoggedIn,
  middleware.isAdmin,
  videoController.deleteVideo
);

// Exporting the router
module.exports = router;
