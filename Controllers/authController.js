// Requiring all the important packages
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

// Requiring all the important modules
const ErrorResponse = require("./../utils/errorResponse");
const User = require("./../models/UserModel");

// Exporting the function for getting the registration page
exports.getRegisterPage = (req, res, next) => {
  res.json("Welcome to the Registration screen");
};

// Exporting the function for posting to the registration page
exports.postRegisterPage = async (req, res, next) => {
  try {
    // Checking if the email, password and username is entered or not
    const { userName, email, password } = req.body;
    if (!email || !password || !userName)
      return next(
        new ErrorResponse("Please fill out all the fields correctly", 400)
      );

    // Checking if the email or username entered is already registered
    const user = await User.findOne({ $or: [{ email }, { userName }] });
    if (user) {
      if (user.email == email)
        return next(
          new ErrorResponse("Email already in use. Please login", 400)
        );
      else return next(new ErrorResponse("Username already taken.", 400));
    }

    // Creating the user based on the data entered
    const createdUser = await User.create(req.body);

    // Gives the jwt token by taking the payload as the id of the newly created user and expires in 3 days
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Sends the response back to the user with cookie of jwt set to the token and expires in 3 days
    res
      .cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true })
      .status(201)
      .json({
        success: true,
        token,
        user: createdUser,
      });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for getting the login page
exports.getLoginPage = (req, res, next) => {
  res.json("Welcome to the login screen");
};

// Exporting the function for posting to the login page
exports.postLoginPage = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Checking if the email and password is entered or not
    if (!email || !password)
      return next(
        new ErrorResponse("Please enter you email and password", 403)
      );

    // Finding the existing user with the entered email or username
    const user = await User.findOne({
      $or: [{ userName: req.body.email }, { email: req.body.email }],
    });

    // Error handling if entered email or username is incorrect
    if (!user)
      return next(
        new ErrorResponse("Incorrect username or email. Please try again.", 400)
      );

    // Error handling if entered password is incorrect
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return next(
        new ErrorResponse("Incorrect password. Please try again.", 400)
      );

    // Gives the jwt token by taking the payload as the id of the newly created user and expires in 3 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Sends the response back to the user with cookie of jwt set to the token and expires in 3 days
    res
      .cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true })
      .status(200)
      .json({
        success: true,
        token,
        user: user._id,
      });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};
