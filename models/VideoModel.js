// Requiring all the important packages
const mongoose = require("mongoose");

// Creating the Schema for users
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    releaseYear: {
      type: Number,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // ratings: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User", // Reference to the User model
    //       required: true,
    //     },
    //     value: {
    //       type: Number,
    //       required: true,
    //     },
    //     createdAt: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
    // main character
  },
  { timestamps: true }
);

// Creating the User model
const Video = mongoose.model("Video", videoSchema);

// Exporting the User model
module.exports = Video;
