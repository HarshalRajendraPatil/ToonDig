// Requiring all the important packages
const jwt = require("jsonwebtoken");

// Requiring all the external packages and internal files
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/UserModel");

// middleware for handling the errors of different types
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Handling the error for resource not found
  if (error.name === "CastError") {
    const message = `Resource not found ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Handling the error for duplicate field values
  if (error.code === 11000) {
    const message = "Duplicate field value entered.";
    error = new ErrorResponse(message, 400);
  }

  // Handling the validation errors
  if (error.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => " " + val.message);
    error = new ErrorResponse(message, 400);
  }

  // Sending the response back to the user
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal server error",
  });
};

// Middleware for checking if the user is logged in or not
exports.isLoggedIn = (req, res, next) => {
  // Getting the token if it exists
  const token = req.cookies.jwt;

  // Redirecting the user to the login page if no token exists
  if (!token) return res.redirect("/api/auth/login");

  // Verifying the token if the token exists
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.redirect("/api/auth/login");
  });

  // Moving on with the next middleware
  next();
};

// Middleware for checking if the user is allowed to access this route
exports.isAdmin = async (req, res, next) => {
  try {
    // Getting the jwt token from the user
    const token = req.cookies.jwt;
    let userId = null;

    // Verifying the jwt token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      // Gives the error the global error middleware
      if (err) next(err);
      // Assigning the payload of the jwt to the userId variable
      userId = payload?.id;
    });

    // Finding the user with the id stored in the jwt
    const user = await User.findById(userId);

    // Handling error if the user with the provided id is not found.
    if (!user) return next(new ErrorResponse("This user does not exists", 404));

    // if the user is allowed to access the routes, we pass to the next middleware
    if (user.access) return next();
    else {
      // Gives the error the global error middleware
      return next(
        new ErrorResponse("You need to be an admin to access this route.", 401)
      );
    }
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};
