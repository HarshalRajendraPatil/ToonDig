// Requiring all the important modules
const ErrorResponse = require("./../utils/errorResponse");
const Video = require("./../models/VideoModel");

// Exporting the function for getting the all the vidoes
exports.getAllVideos = async (req, res, next) => {
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
exports.getVideo = async (req, res, next) => {
  try {
    // Extracting the video id from the URL
    const videoId = req.params.id;

    // Getting the videos from the database based on id
    const video = await Video.findOne({ _id: videoId });

    // Sending back the response with all the videos
    res.status(200).json({
      status: true,
      video,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for uploading the video
exports.postVideo = async (req, res, next) => {
  try {
    // Checking if the admin has entered all the fields to upload a video
    const { title, description, category, genre, releaseYear, videoUrl } =
      req.body;
    if (!(title && description && category && genre && releaseYear && videoUrl))
      return next(new ErrorResponse("Please fill all the fields", 400));

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
exports.editVideo = async (req, res, next) => {
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
exports.deleteVideo = async (req, res, next) => {
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
