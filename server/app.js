// Requiring all the important packages
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Requiring all the important modules
import dotenv from "dotenv";
dotenv.config();
import db from "./dataBaseConnection.js";
import middleware from "./Middlewares/middleware.js";

// Requiring all the Route files
import authRoute from "./Routes/authRoute.js";
import userRoute from "./Routes/api/userRoutes.js";
import videoRoute from "./Routes/api/videoRoutes.js";

// Creating the instance of express which acts like the application
const app = express();

// Settings for the server
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("public"));

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
