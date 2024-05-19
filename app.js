
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const teacherRouter = require("./routes/teacher");
const studentRouter = require("./routes/student");
const adminRouter = require("./routes/admin");
const headRouter = require("./routes/head");
const coursesRouter = require("./routes/courses");

const app = express();

// Load environment variables from .env file

require("dotenv-safe").config({
  example: ".env.example",
  path: ".env",
});

//database connection

try {
  const uri = process.env.URI;

  mongoose.connect(uri);

  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("Database connected successfully");
  });
} catch (err) {
  console.log(err);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/head", headRouter);
app.use("/courses", coursesRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
