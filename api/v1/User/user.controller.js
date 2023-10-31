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
const {
  register,
  signin,
  editUserProfile,
  setFcmToken,
  getUserDetails,
} = require("./user.service");
const { body, query } = require("express-validator");
const { requireSignin } = require("../_middleware/auth");
const { validateUsername } = require("./user.helper");

//////////////////////////////User Auth//////////////////////////////////////////////

router.post(
  "/register",
  validateRegistrationRequest,
  isRequestValidated,
  validate([body("username", "Please provide username").notEmpty()]),
  function (req, res, next) {
    register(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/auth",
  validateSigninRequest,
  isRequestValidated,
  function (req, res, next) {
    signin(req)
      .then(({ statusCode, token, user, data }) => {
        res.status(statusCode).json({ token, user, data });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get("/validateToken", requireSignin, function (req, res, next) {
  res.status(200).json();
});

//////////////////////////////User Details//////////////////////////////////////////////

router.put(
  "/edit-profile",
  requireSignin,
  isRequestValidated,
  validate([body("id", "Please provide User Id").notEmpty()]),
  function (req, res, next) {
    editUserProfile(req)
      .then(({ statusCode, token, user, data }) => {
        res.status(statusCode).json({ token, user, data });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put(
  "/set-fcm-token",
  requireSignin,
  isRequestValidated,
  validate([body("id", "Please provide User Id").notEmpty()]),
  validate([body("fcmToken", "fcmToken token required").notEmpty()]),
  function (req, res, next) {
    setFcmToken(req)
      .then(({ statusCode, token, message }) => {
        res.status(statusCode).json({ token, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get("/get-user-details", requireSignin, function (req, res, next) {
  getUserDetails(req)
    .then(({ statusCode, user, message }) => {
      res.status(statusCode).json({ user, message });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
