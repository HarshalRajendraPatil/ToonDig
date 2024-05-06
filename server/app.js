// Requiring all the important packages
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Requiring all the important modules
require("dotenv").config();
require("./dataBaseConnection");
const middleware = require("./Middlewares/middleware");

// Requiring all the Route files
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/api/userRoutes");
const videoRoute = require("./Routes/api/videoRoutes");

// Creating the instance of express which acts like the application
const app = express();

// Settings for the server
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

// Request for "/" page
app.get("/", middleware.isLoggedIn, (req, res, next) => {
  res.send("hello form the server");
});

// Requests for "/login, /register, /forgotpassword and /logout" page
app.use("/api/auth", authRoute);

// Request for User api
app.use("/api", userRoute);

// Request for Video api
app.use("/api", videoRoute);

// Global Error middleware
app.use(middleware.errorHandler);

// Setting up the port and starting the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
