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

const getSessionById = async (req) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId)
      .populate({
        path: "therapistId",
        select: "id username firstname lastname age email phone profilePicUrl",
      })
      .populate({
        path: "patientId",
        select: "id username firstname lastname age email phone profilePicUrl",
      });

    if (!session) {
      throw new NotFoundError("Session not found");
    }

    const applications = await SessionApplication.find({
      sessionId: sessionId,
    }).populate({
      path: "applicationId",
      select:
        "id applicationName applicationIframeURL isCameraRequired isMicrophoneRequired applicationCategoryId",
    });

    if (!applications || applications.length === 0) {
      throw new NotFoundError("Session applications not found");
    }

    const applicationsWithParams = await Promise.all(
      applications.map(async (application) => {
        const applicationId = application.applicationId._id;

        const applicationParams = await ApplicationParams.find({
          applicationId: applicationId,
        });

        const applicationCopy = { ...application.toObject() };

        if (applicationParams.length > 0) {
          applicationCopy.applicationId.applicationParams = applicationParams;
        } else {
          applicationCopy.applicationId.applicationParams = [];
        }

        return applicationCopy;
      })
    );

    return {
      statusCode: 200,
      data: {
        session: session,
        application: applicationsWithParams,
      },
      message: "Session retrieved successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

module.exports = {
  getSessionById,
};
