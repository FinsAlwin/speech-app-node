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
const { getSession } = require("./patient.service");
const { body, query } = require("express-validator");
const { requireSignin } = require("../_middleware/auth");
const { validateUsername } = require("./patient.helper");

//////////////////////////////User notification//////////////////////////////////////////////

router.get(
  "/session",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    getSession(req)
      .then(({ statusCode, sessions, message }) => {
        res.status(statusCode).json({ sessions, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
