// Requiring all the important packages
const express = require("express");

// Requiring all the important modules
const videoController = require("./../../Controllers/videoController");
const middleware = require("./../../Middlewares/middleware");

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for GET request "/api/videos" URL to get all the videos
router.get("/videos", middleware.isLoggedIn, videoController.getAllVideos);

// Route for get request "/api/videos/upload" URL to get the upload form
router.get(
  "/videos/upload",
  middleware.isLoggedIn,
  middleware.isAdmin,
  videoController.getPostVideo
);

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
router.get(
  "/videos/edit/:id",
  middleware.isLoggedIn,
  middleware.isAdmin,
  videoController.getEditVideo
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

// Route for post request "/api/videos/:id/comments/add" URL to comment on a video
router.post(
  "/videos/:id/comments/add",
  middleware.isLoggedIn,
  videoController.addComment
);

// Route for put request
router.put(
  "/videos/:videoId/comments/:commentId",
  middleware.isLoggedIn,
  videoController.editComment
);

// Route for delete request "/api/videos/:videoId/comments/delete/:commentId" URL to delete a comment on a video
router.delete(
  "/videos/:videoId/comments/delete/:commentId",
  middleware.isLoggedIn,
  videoController.deleteComment
);

// Exporting the router
module.exports = router;
