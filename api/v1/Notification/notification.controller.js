const express = require("express");
const router = express.Router();
const {
  isRequestValidated,
  validate,
} = require("../../../validators/request_validator");
const {
  validateRegistrationRequest,
  validateSigninRequest,
} = require("../../../validators/admin");
const { getNotification, addNotification } = require("./notification.service");
const { body, query } = require("express-validator");
const { requireSignin } = require("../_middleware/auth");
const { validateUsername } = require("./notification.helper");

//////////////////////////////User notification//////////////////////////////////////////////

router.get("/", requireSignin, isRequestValidated, function (req, res, next) {
  getNotification(req)
    .then(({ statusCode, notification, message }) => {
      res.status(statusCode).json({ notification, message });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/",
  requireSignin,
  isRequestValidated,
  validate([body("userId", "Please provide User Id").notEmpty()]),
  validate([body("title", "Notification title required").notEmpty()]),
  validate([
    body("description", " Notification description required").notEmpty(),
  ]),
  function (req, res, next) {
    addNotification(req)
      .then(({ statusCode, notification, message }) => {
        res.status(statusCode).json({ notification, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
