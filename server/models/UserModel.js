// Requiring all the important packages
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Creating the Schema for users
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please provide a Username."],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide the e-mail."],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide the password."],
      minlength: [8, "Password must contain at least 8 characters"],
    },
    access: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Hashing the password before storing them
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

// Creating the User model
const User = mongoose.model("User", userSchema);

// Exporting the User model
module.exports = User;
