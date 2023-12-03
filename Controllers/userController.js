// Requiring all the important modules
const ErrorResponse = require("./../utils/errorResponse");
const User = require("./../models/UserModel");

// Exporting the function for getting the all the users
exports.getAllUsers = async (req, res, next) => {
  try {
    // Getting all the users from the database
    const users = await User.find({});
    // Sending back the response with all the users
    res.status(200).json({
      status: true,
      results: users.length,
      users,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for getting a single user based on id
exports.getUser = async (req, res, next) => {
  try {
    // Extracting the user id from the URL
    const userId = req.params.id;

    // Finding the user in the database with given id and deselecting its password field
    const user = await User.findById(userId).select("-password");

    // Handling the error if no user if found
    if (!user) return next(new ErrorResponse("No user found!!", 404));

    // Sending back the response
    res.status(200).json({
      status: true,
      user,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for updaing a single user based on id
exports.updateUser = async (req, res, next) => {
  // Yet to implement
  try {
    res.status(200).json({
      status: true,
      message: "Updated Successfully",
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for deleting a single user based on id
exports.deleteUser = async (req, res, next) => {
  try {
    // Extracting the user id from the URL
    const userId = req.params.id;

    // Finding the user in the database with given id
    const user = await User.findByIdAndDelete(userId);

    // Handling the error if no user if found
    if (!user) return next(new ErrorResponse("No User found!!", 404));

    // Sending back the response
    res.status(204);
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};
