const User = require("../../../models/Users.model");
const Session = require("../../../models/Session.model");
const SessionApplication = require("../../../models/SessionApplication.model");
const ApplicationParams = require("../../../models/ApplicationParams.model");
const Notification = require("../../../models/Notification.model");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../utils/api_error_util");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const getSession = async ({ body, headers }) => {
  const { sessionId } = body;

  try {
    if (headers.authorization) {
      const token = headers.authorization.split(" ")[1];
      const userAuth = jwt.verify(token, process.env.SAFE_WORD);

      const user = await User.findOne({
        username: userAuth.username,
      });

      if (!user) {
        throw new BadRequestError(
          "User with this Username could not be found....."
        );
      }

      const {
        id,
        username,
        isPatient,
        firstname,
        lastname,
        age,
        email,
        phone,
        isSelfRegistration,
        subscriptionId,
        profilePicUrl,
        fcmToken,
      } = user;

      if (user.isPatient) {
        const session = await Session.findById(sessionId).populate({
          path: "therapistId",
          select:
            "id username firstname lastname age email phone profilePicUrl",
        });

        return {
          statusCode: 200,
          data: {
            user: {
              id,
              username,
              isPatient,
              firstname,
              lastname,
              age,
              email,
              phone,
              isSelfRegistration,
              subscriptionId,
              profilePicUrl,
              fcmToken,
            },
            session,
          },

          message: "Session retrieved successfully",
        };
      } else {
        const session = await await Session.findById(sessionId).populate({
          path: "patientId",
          select:
            "id username firstname lastname age email phone profilePicUrl",
        });
        return {
          statusCode: 200,
          data: {
            user: {
              id,
              username,
              isPatient,
              firstname,
              lastname,
              age,
              email,
              phone,
              isSelfRegistration,
              subscriptionId,
              profilePicUrl,
              fcmToken,
            },
            session,
          },

          message: "Session retrieved successfully",
        };
      }
    }
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

module.exports = {
  getSession,
};
