// Requiring all the external packages and internal files
const ErrorResponse = require("./../utils/errorResponse");

// Function for handling the errors of different types
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(error);

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

// Exporting the function to handle errors
module.exports = errorHandler;
