// Requiring all the important packages
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Requiring all the important modules
require("dotenv").config();
require("./dataBaseConnection");
const error = require("./Middlewares/error");

// Requiring all the Route files
const authRoute = require("./Routes/authRoute");

// Creating the instance of express which acts like the application
const app = express();

// Settings for the server
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

// Get requrest for "/" page
app.get("/", (req, res, next) => {
  res.send("hellow form the server");
});

// Get request for "/login, /register, /forgotpassword and /logout" page
app.use("/", authRoute);
app.use(error);

// Setting up the port and starting the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
