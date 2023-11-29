// Requiring all the important packages
const cookieParser = require("cookie-parser");
const express = require("express");

// Requiring all the important modules
require("dotenv").config();
require("./dataBaseConnection");

// Creating the instance of express which acts like the application
const app = express();

// Settings for the server
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res, next) => {
  res.send("hellow form the server");
});

// Setting up the port and starting the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
