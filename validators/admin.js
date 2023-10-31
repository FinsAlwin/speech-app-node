const { check } = require("express-validator");

const validateRegistrationRequest = [
  check("username").notEmpty().withMessage("Username is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

const validateSigninRequest = [
  check("username").notEmpty().withMessage("Username is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  validateRegistrationRequest,
  validateSigninRequest,
};
