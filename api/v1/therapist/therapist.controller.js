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
  getPatients,
  getPatientById,
  createSession,
  getSession,
  getSessionType,
  deleteApplication,
} = require("./therapist.service");
const { body, query } = require("express-validator");
const { requireSignin } = require("../_middleware/auth");
const { validateUsername } = require("./therapist.helper");

//////////////////////////////User notification//////////////////////////////////////////////

router.get(
  "/get-patients",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    getPatients(req)
      .then(({ statusCode, users, message }) => {
        res.status(statusCode).json({ users, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get(
  "/get-patients/:userId",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    getPatientById(req)
      .then(({ statusCode, user, message }) => {
        res.status(statusCode).json({ user, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/session",
  requireSignin,
  isRequestValidated,
  validate([body("sessionName", "Please provide sessionName").notEmpty()]),
  validate([body("therapistId", "Please provide therapistId").notEmpty()]),
  validate([body("patientId", "Please provide patientId.").notEmpty()]),
  function (req, res, next) {
    createSession(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).json({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

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

router.delete(
  "/session/:id",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    deleteApplication(req)
      .then(({ statusCode, sessions, message }) => {
        res.status(statusCode).json({ sessions, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get(
  "/session-type",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    getSessionType(req)
      .then(({ statusCode, sessionTypes, message }) => {
        res.status(statusCode).json({ sessionTypes, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
