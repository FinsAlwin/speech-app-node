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
const { getSessionById } = require("./session.service");
const { body, query } = require("express-validator");
const { requireSignin } = require("../_middleware/auth");
const { validateUsername } = require("./session.helper");

//////////////////////////////User notification//////////////////////////////////////////////

router.get(
  "/:sessionId",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    getSessionById(req)
      .then(({ statusCode, data, message }) => {
        res.status(statusCode).json({ data, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
