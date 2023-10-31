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
  getSubscription,
  addSubscription,
  editSubscription,
  deleteSubscription,
  getApplicationCategory,
  addApplicationCategory,
  editApplicationCategory,
  deleteApplicationCategory,
  getApplication,
  addApplication,
  editApplication,
  deleteApplication,
  getUsers,
  getApplicationParams,
  addApplicationParams,
  editApplicationParams,
  deleteApplicationParams,
} = require("./admin.service");
const { body, query } = require("express-validator");
const { requireSignin } = require("../_middleware/auth");

//////////////////////////////Super Admin Auth//////////////////////////////////////////////

router.post(
  "/register",
  validateRegistrationRequest,
  isRequestValidated,
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

//////////////////////////////Subscription//////////////////////////////////////////////

router.get("/subscription", requireSignin, function (req, res, next) {
  getSubscription()
    .then(({ statusCode, data, message }) => {
      res.status(statusCode).send({ data, message });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/subscription",
  requireSignin,
  isRequestValidated,
  validate([
    body("subscriptionName", "Please provide subscription name.").notEmpty(),
  ]),
  function (req, res, next) {
    addSubscription(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put(
  "/subscription",
  requireSignin,
  isRequestValidated,
  validate([
    body("id", "Please provide product Id").notEmpty(),
    body("subscriptionName", "Please provide subscription name").notEmpty(),
  ]),
  function (req, res, next) {
    editSubscription(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete(
  "/subscription",
  requireSignin,
  isRequestValidated,
  validate([body("id", "Please provide subscription Id").notEmpty()]),
  function (req, res, next) {
    deleteSubscription(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

//////////////////////////////Application Category//////////////////////////////////////////////

router.get("/application-category", requireSignin, function (req, res, next) {
  getApplicationCategory()
    .then(({ statusCode, data, message }) => {
      res.status(statusCode).send({ data, message });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/application-category",
  requireSignin,
  isRequestValidated,
  validate([body("categoryName", "Please provide category name").notEmpty()]),
  function (req, res, next) {
    addApplicationCategory(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put(
  "/application-category",
  requireSignin,
  isRequestValidated,
  validate([
    body("id", "Please provide product Id").notEmpty(),
    body("categoryName", "Please provide category name").notEmpty(),
  ]),
  function (req, res, next) {
    editApplicationCategory(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete(
  "/application-category",
  requireSignin,
  isRequestValidated,
  validate([body("id", "Please provide game category Id").notEmpty()]),
  function (req, res, next) {
    deleteApplicationCategory(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

//////////////////////////////Application//////////////////////////////////////////////

router.get("/application", requireSignin, function (req, res, next) {
  getApplication()
    .then(({ statusCode, data, message }) => {
      res.status(statusCode).send({ data, message });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/application",
  requireSignin,
  isRequestValidated,
  validate([
    body("applicationName", "Please provide application name.").notEmpty(),
    body("applicationIframeURL", "Please provide application url.").notEmpty(),
    body("subscriptionId", "Please provide subscription Id.").notEmpty(),
    body(
      "applicationCategoryId",
      "Please provide application category id."
    ).notEmpty(),
  ]),
  function (req, res, next) {
    addApplication(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put(
  "/application",
  requireSignin,
  isRequestValidated,
  validate([
    body("id", "Please provide application Id").notEmpty(),
    body("applicationName", "Please provide application name.").notEmpty(),
    body("applicationIframeURL", "Please provide application url.").notEmpty(),
    body("subscriptionId", "Please provide subscription Id.").notEmpty(),
    body(
      "applicationCategoryId",
      "Please provide application category id."
    ).notEmpty(),
  ]),
  function (req, res, next) {
    editApplication(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete(
  "/application",
  requireSignin,
  isRequestValidated,
  validate([body("id", "Please provide application Id").notEmpty()]),
  function (req, res, next) {
    deleteApplication(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

//////////////////////////////Application//////////////////////////////////////////////

router.get("/application/params", requireSignin, function (req, res, next) {
  getApplicationParams()
    .then(({ statusCode, data, message }) => {
      res.status(statusCode).send({ data, message });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/application/params",
  requireSignin,
  isRequestValidated,
  validate([body("param", "Please provide application param.").notEmpty()]),
  function (req, res, next) {
    addApplicationParams(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put(
  "/application/params",
  requireSignin,
  isRequestValidated,
  validate([
    body("id", "Please provide application Id").notEmpty(),
    body("param", "Please provide application param.").notEmpty(),
  ]),
  function (req, res, next) {
    editApplicationParams(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete(
  "/application/params",
  requireSignin,
  isRequestValidated,
  validate([body("id", "Please provide application param Id").notEmpty()]),
  function (req, res, next) {
    deleteApplicationParams(req)
      .then(({ statusCode, message }) => {
        res.status(statusCode).send({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

//////////////////////////////Users//////////////////////////////////////////////

router.get(
  "/users",
  requireSignin,
  isRequestValidated,
  function (req, res, next) {
    getUsers(req)
      .then(({ statusCode, users, message }) => {
        res.status(statusCode).json({ users, message });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
