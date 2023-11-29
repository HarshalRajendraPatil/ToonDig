const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please provide a Username."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide the e-mail."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide the password."],
      minlenght: 6,
    },
    access: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
