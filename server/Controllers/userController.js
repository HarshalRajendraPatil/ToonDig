// Requiring all the important modules
import bcrypt from "bcryptjs";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/UserModel.js";

// Exporting the function for getting the all the users
const getAllUsers = async (req, res, next) => {
  try {
    // Implementing basic pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    // Getting all the users from the database
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

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
const getUser = async (req, res, next) => {
  try {
    // Finding the user in the database with id and deselecting its password field
    const user = await User.findById(req.cookies.userId).select(
      "-password -token"
    );

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
const updateUser = async (req, res, next) => {
  // Yet to implement
  try {
    // Getting the value of email and userName from the request body.
    const email = req.body.email;
    const userName = req.body.userName;

    // Handling the error is both the field are not provided
    if (!email && !userName)
      return next(new ErrorResponse("Please update at least one field.", 404));

    // Getting the id from the cookie
    const { userId } = req.cookies;

    // Creating the update object
    const updateValue = {
      userName: userName,
      email: email,
    };

    // Checking if the email or username entered is already registered
    const user = await User.findOne({ $or: [{ email }, { userName }] });
    if (user) {
      if (user.email == email)
        return next(new ErrorResponse("Email already in use.", 400));
      else return next(new ErrorResponse("Username already taken.", 400));
    }

    // Updating and returning the updated user
    const updatedUser = await User.findByIdAndUpdate(userId, updateValue, {
      new: true,
      runValidators: true,
    }).select("-password");

    // Returning response to the user
    res.status(200).json({
      status: true,
      updatedUser,
    });
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

// Exporting the function for deleting a single user based on id
const deleteUser = async (req, res, next) => {
  try {
    // Extracting the user id from the cookie
    const { userId } = req.cookies;

    // Finding the user in the database with given id
    const user = await User.findByIdAndDelete(userId);

    // Handling the error if no user if found
    if (!user) return next(new ErrorResponse("No User found!!", 404));

    // Sending back the response
    res
      .status(204)
      .cookie("jwt", "", { maxAge: 0 })
      .cookie("userId", "", {
        maxAge: 0,
      })
      .json();
  } catch (error) {
    // Gives the error the global error middleware
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    // Getting the id from the cookie
    const { userId } = req.cookies;

    // Getting the value of password from the request body
    const password = req.body.password;

    // Getting the value of previous password from the request body
    const previousPassword = req.body.previousPassword;

    // Handling the error if no previous password is provided
    if (!previousPassword)
      return next(new ErrorResponse("Please enter the previous password", 400));

    // Handling the error if no new password is provided
    if (!password)
      return next(new ErrorResponse("Please enter the new password", 400));

    // Finding the user with the id
    const user = await User.findById(userId);

    // Handling the error if no user if found with the provided id
    if (!user) return next(new ErrorResponse("No user found!", 404));

    // Checking if the previous password entered is correct or not
    if (!(await bcrypt.compare(previousPassword, user.password)))
      return next(new ErrorResponse("Wrong Password", 400));

    // Handling the error if the length of the password is less than 8 characters
    if (password.length < 8)
      return next(
        new ErrorResponse("Password must contain at least 8 characters", 400)
      );

    // Handling the error if the new password is same as current password
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame)
      return next(
        new ErrorResponse(
          "New password should be different from the current one.",
          400
        )
      );

    // Hashing the new password
    const hashedPass = await bcrypt.hash(password, 10);

    // Updating the the user with new password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { password: hashedPass },
      },
      { new: true, runValidators: true }
    ).select("-password -token");

    // Returning response to the user
    res.status(200).json({
      status: true,
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllUsers, getUser, changePassword, updateUser, deleteUser };
