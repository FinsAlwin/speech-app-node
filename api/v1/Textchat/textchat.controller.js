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
const { getSession } = require("./textchat.service");
const { body, query } = require("express-validator");
const { requireSignin } = require("../_middleware/auth");
const { validateUsername } = require("./textchat.helper");

//////////////////////////////User notification//////////////////////////////////////////////

router.post(
  "/session",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    getSession(req)
      .then(({ statusCode, data, message }) => {
        res.status(statusCode).json({ data, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
