// Requiring all the important packages
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const randomString = require("randomstring");

// Requiring all the important modules
const ErrorResponse = require("./../utils/errorResponse");
const User = require("./../models/UserModel");

// Global variable for storing id and token for forgot-password acc
let global = {
  id: null,
  token: null,
};

// Exporting the function for getting the registration page
exports.getRegisterPage = (req, res, next) => {
  res.render("register");
};

// Exporting the function for posting to the registration page
exports.postRegisterPage = async (req, res, next) => {
  try {
    // Checking if the email, password and username is entered or not
    const { userName, email, password } = req.body;
    console.log(userName, email, password);
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

    req.user = createdUser;

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
  res.render("login");
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
      return next(new ErrorResponse("Incorrect username or email.", 400));

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

    req.user = user;

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

// Exporting the function for getting the forgot password page
exports.getForgotPassword = (req, res, next) => {
  res.render("forgot-password");
};

// Exporting the function for posting to the forgot password page
exports.postForgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    // Checking if the email is entered or not
    if (!email) return next(new ErrorResponse("Please enter you email", 403));

    // Getting the user from the database with entered database
    const userData = await User.findOne({ email });

    // Handling error if the user is not found with entered email
    if (!userData)
      return next(
        new ErrorResponse("This email does not exists. Please Register.", 400)
      );

    // Generating a random token with characters
    const token = randomString.generate();

    // Setting the id to token to the global variables
    global.id = userData._id;
    global.token = token;

    // If the user is found, we update the token field and return the new doc.
    const data = await User.findByIdAndUpdate(
      userData._id,
      { $set: { token } },
      { new: true, runValidators: true }
    );

    // Calling the function to send the reset-password mail and returnt the response
    sendResetPasswordMail(data.userName, data.email, token, next, res);
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for getting the reset password page
exports.getResetPassword = (req, res, next) => {
  res.render("reset-password");
};

// Exporting the function for posting to the forgot password page
exports.postResetPassword = async (req, res, next) => {
  try {
    // Getting the value of password from the user
    const newPass = req.body.password;

    // Checking if the password is entered or not
    if (!newPass)
      return next(new ErrorResponse("Please enter the new password", 400));

    // Checking if the lenght of password is greater than 8 or not
    if (!(newPass.length >= 8))
      return next(
        new ErrorResponse("Password must contain at least 8 characters", 400)
      );

    // Hashing the password
    const hashedPass = await bcrypt.hash(newPass, 10);

    // Getting the token from the URL
    // const token = req.url.split("=")[1];

    // Finding the user in the database with the provided token
    const tokenUser = await User.findById(global.id);

    // Throwing error if no user with that token is found
    if (tokenUser.token !== global.token)
      return next(new ErrorResponse("The token has already expired.", 400));

    // Updating the user with the new password and returning the new doc.
    const updatedUser = await User.findByIdAndUpdate(
      tokenUser._id,
      {
        $set: { token: "", password: hashedPass },
      },
      { new: true, runValidators: true }
    );

    // Setting the default values to global variables
    global.id = null;
    global.token = null;

    // Sending the response to the user with the updated user
    res.status(200).json({
      success: true,
      message: "Your password has been reset successfully",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Exporting the function for getting the reset password page
exports.getLogout = (req, res, next) => {
  // Setting the value of jwt cookie to an empty string and then destroying the cookie in 1 ms followed by redirecting the user to the home page.
  res.cookie("jwt", "", { maxAge: 1 }).redirect("/api/auth/login");
};

// Fucntion for sending the mail of the reset-password and the response back to the user.
const sendResetPasswordMail = async function (
  userName,
  email,
  token,
  next,
  res
) {
  try {
    // Setting up the mail which will send the email
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Setting up the content of the email
    const mailOption = {
      from: {
        name: "ToonDig",
        address: process.env.USER,
      },
      to: email,
      subject: "Reset Password",
      html: `<p>Hi ${userName}, please copy the link and <a href="https://toondig.onrender.com/api/auth/reset-password?token=${token}">reset your password</a></p>`,
    };

    // Sending the mail to the given email
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
        next(
          // Gives the error the global error middleware
          new ErrorResponse("Failed to send the mail. Try again later", 500)
        );
      }
    });

    // Sending the response back to the user
    res.status(200).json({
      success: true,
      message: `A link to reset you password has been send to ${email}.`,
      token,
    });
  } catch (error) {
    // Gives the error the global error middleware
    console.log(error);
    next(error);
  }
};
