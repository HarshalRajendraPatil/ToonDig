// Requiring all the important modules
import ErrorResponse from "../utils/errorResponse.js";
import Video from "./../models/VideoModel.js";
import mongoose from "mongoose";
import User from "../models/UserModel.js";

// Exporting the function for getting the all the vidoes
const getAllVideos = async (req, res, next) => {
  try {
    // Implementing basic pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    // Getting all the videos from the database
    const videos = await Video.find({})
      .skip((page - 1) * limit)
      .limit(limit);
    // Sending back the response with all the videos
    res.status(200).json({
      status: true,
      results: videos.length,
      videos,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for getting a single video based on id
const getVideo = async (req, res, next) => {
  try {
    // Extracting the video id from the URL
    const videoId = req.params.id;

    // Getting the videos from the database based on id
    const video = await Video.findById(videoId);

    // Sending back the response with all the videos
    res.status(200).json({
      status: true,
      video,
    });
  } catch (error) {
    // Gives the error the global error middlewarexx
    next(error);
  }
};

// Exporting the function for uploading the video
const postVideo = async (req, res, next) => {
  try {
    // Checking if the admin has entered all the fields to upload a video
    const { title, description, category, genre, releaseYear, videoUrl } =
      req.body;
    if (!(title && description && category && genre && releaseYear && videoUrl))
      return next(new ErrorResponse("Please fill all the fields", 400));

    const repeatedVideo = await Video.findOne({
      $or: [{ title }, { videoUrl }],
    });
    if (repeatedVideo) {
      if (repeatedVideo.title == title)
        return next(new ErrorResponse("This title is already taken.", 400));
      else return next(new ErrorResponse("This video is already present", 400));
    }

    // Creating the object to be saved
    const data = { title, description, category, genre, releaseYear, videoUrl };

    // Saving the video to the database
    const video = await Video.create(data);

    // Sending back the response with the uploaded video
    res.status(200).json({ status: true, details: video });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for updaing a single video based on id
const editVideo = async (req, res, next) => {
  try {
    // Extracting the video id from the URL
    const videoId = req.params.id;

    // Checking if user has entered at least one field to be changed
    if (!req.body)
      return next(
        new ErrorResponse("Please change a value to edit the video", 400)
      );

    // Finding and updating the video in the database
    const video = await Video.findByIdAndUpdate(videoId, req.body, {
      new: true,
    });

    // Handling the error if the video does not exists
    if (!video)
      return next(new ErrorResponse("The video does not exists", 404));

    // Sending back the response with the updated video
    res.status(200).json({
      status: true,
      data: video,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for deleting a single video based on id
const deleteVideo = async (req, res, next) => {
  try {
    // Extracting the video id from the URL
    const videoId = req.params.id;

    // Finding the video in the database with given id
    const video = await Video.findByIdAndDelete(videoId);

    // Handling the error if no video if found
    if (!video) return next(new ErrorResponse("No video found!!", 404));

    // Sending back the response
    res.status(204).redirect("/api/videos");
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for commenting on a video
const addComment = async (req, res, next) => {
  try {
    // Getting the video id from the url
    const videoId = req.params.id;

    // Early return when no comment body is provided
    if (!req.body.comment)
      return next(new ErrorResponse("Please enter a comment", 400));

    // Finding and updating the comment section of the video
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $push: {
          comments: { user: req.cookies.userId, text: req.body.comment },
        },
      },
      { new: true }
    );

    // Handling error if the video does not exists.
    if (!video)
      return next(new ErrorResponse("This video does not exists", 404));

    // Sending back the response
    res.status(200).json({
      status: true,
      video,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    // Getting all the id's
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;
    const userId = req.cookies.userId;
    const newText = req.body.text;

    // Find the video and logged user by ID
    const video = await Video.findById(videoId);
    const user = await User.findById(userId);

    // Handling error if no video is found
    if (!video) {
      return next(new ErrorResponse("Video not found", 404));
    }

    // Find the comment by ID
    const comment = video.comments.id(commentId);

    // Handling error if no comment is found
    if (!comment) {
      return next(new ErrorResponse("Comment not found", 404));
    }

    // Check if the user owns the comment
    if (!user.access && comment.user.toString() !== userId.toString()) {
      return next(
        new ErrorResponse(
          "You do not have permission to edit this comment.",
          400
        )
      );
    }

    // Update the comment text
    comment.text = newText;
    await video.save();

    // Sending bak the response
    res.status(200).json({ status: true, video });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for deleting a comment on a video
const deleteComment = async (req, res, next) => {
  try {
    // Getting the video and comment id from the url
    const { videoId, commentId } = req.params;

    // Getting the logged in user and the video of the comment
    const loggedUser = await User.findById(req.cookies.userId);
    const fromVideo = await Video.findById(videoId);

    // finding the exact comment to delete
    const postToDelete = fromVideo.comments.find(
      (comment) => comment._id == commentId
    );

    // Allowing access to admin and the author to delete the post
    if (
      !loggedUser.access &&
      !(postToDelete.user.toString() == req.cookies.userId)
    )
      return next(new ErrorResponse("You are not the author of the post", 400));

    // Finding and updating the comment section of the video
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $pull: {
          comments: { _id: new mongoose.Types.ObjectId(commentId) },
        },
      },
      { new: true }
    );

    // Handling error if the video does not exists.
    if (!video)
      return next(new ErrorResponse("This video does not exists", 404));

    res.status(200).json({
      status: true,
      video,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

export default {
  getAllVideos,
  getVideo,
  postVideo,
  editVideo,
  deleteVideo,
  getComments,
  editComment,
  deleteComment,
  addComment,
};
