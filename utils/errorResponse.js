// Class for handling the errors
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Exprting the class and not its object
module.exports = ErrorResponse;
