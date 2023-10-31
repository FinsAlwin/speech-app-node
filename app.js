var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

var app = express();
app.use(cors());

const mongoString = process.env.MONGO_URI;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(fileUpload());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

//api routes
app.use("/api/admin", require("./api/v1/Admin/admin.controller"));

app.use("/api/user", require("./api/v1/User/user.controller"));
app.use(
  "/api/user/notification",
  require("./api/v1/Notification/notification.controller")
);
app.use("/api/therapist", require("./api/v1/therapist/therapist.controller"));

app.use("/api/patient", require("./api/v1/patient/patient.controller"));

app.use("/api/session", require("./api/v1/session/session.controller"));

app.use("/api/app", require("./api/v1/Textchat/textchat.controller"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

app.use(function (err, req, res, next) {
  // Set the response status code
  res.status(err.status || 500);

  // Send the error as JSON
  res.json({
    error: {
      message: err.message,
      // stack: req.app.get("env") === "development" ? err.stack : undefined,
    },
  });
});

module.exports = app;
