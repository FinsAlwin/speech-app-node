const User = require("../../../models/Users.model");
const Session = require("../../../models/Session.model");
const SessionApplication = require("../../../models/SessionApplication.model");
const Notification = require("../../../models/Notification.model");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../utils/api_error_util");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const getPatients = async () => {
  try {
    const users = await User.find({
      isPatient: true,
    });

    if (!users) {
      throw new NotFoundError("Users  could not be found.....");
    }

    const formattedUsers = users.map((user) => {
      const {
        id,
        username,
        isPatient,
        firstname,
        lastname,
        age,
        email,
        phone,
        profilePicUrl,
      } = user;

      return {
        id,
        username,
        isPatient,
        firstname,
        lastname,
        age,
        email,
        phone,
        profilePicUrl,
      };
    });

    return {
      statusCode: 200,
      users: formattedUsers,
      message: "User Details retrived successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const getPatientById = async (req) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("Patient not found");
    }

    // Format the user object as needed
    const formattedUser = {
      id: user.id,
      username: user.username,
      isPatient: user.isPatient,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      email: user.email,
      phone: user.phone,
      profilePicUrl: user.profilePicUrl,
    };

    return {
      statusCode: 200,
      user: formattedUser,
      message: "Patient details retrieved successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const getSessionType = async () => {
  try {
    const sessionType = await SessionType.find();

    if (!sessionType) {
      throw new NotFoundError("Session type could not be found.....");
    }

    return {
      statusCode: 200,
      sessionTypes: sessionType,
      message: "User Details retrived successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const createSession = async ({ body }) => {
  const { sessionName, therapistId, patientId, applicationIds } = body;

  try {
    const therapist = await User.findById(therapistId);

    if (!therapist) {
      throw new NotFoundError("Therapist could not be found.....");
    }

    const patient = await User.findById(patientId);

    if (!patient) {
      throw new NotFoundError("Patient could not be found.....");
    }

    const newSession = new Session({
      sessionName,
      therapistId,
      patientId,
    });
    await newSession.save();

    if (applicationIds.length > 0) {
      // Check if there are selected applicationIds
      for (const application of applicationIds) {
        const newApplication = new SessionApplication({
          sessionId: newSession.id,
          applicationId: application.value,
        });
        await newApplication.save();
      }
    }

    await sendNotification(
      patient.fcmToken,
      "New Session Created",
      `Session: ${sessionName} | Created By: @${therapist.username}`,
      patientId
    );

    return {
      statusCode: 201,
      message: "Session type registration completed successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const getSession = async ({ headers }) => {
  try {
    if (headers.authorization) {
      const token = headers.authorization.split(" ")[1];
      const userAuth = jwt.verify(token, process.env.SAFE_WORD);

      const user = await User.findOne({
        username: userAuth.username,
      });

      if (user.isPatient) {
        const sessions = await Session.find({
          patientId: user.id,
        }).populate({
          path: "therapistId",
          select:
            "id username firstname lastname age email phone profilePicUrl",
        });

        if (!sessions) {
          throw new NotFoundError("Sessions could not be found.....");
        }

        return {
          statusCode: 200,
          sessions: sessions,
          message: "Sessions retrived successfully",
        };
      } else {
        const sessions = await Session.find({
          therapistId: user.id,
        }).populate({
          path: "patientId",
          select:
            "id username firstname lastname age email phone profilePicUrl",
        });

        if (!sessions) {
          throw new NotFoundError("Sessions could not be found.....");
        }

        return {
          statusCode: 200,
          sessions: sessions,
          message: "Sessions retrived successfully",
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

const deleteApplication = async (req) => {
  const { id } = req.params;
  try {
    const deletedSession = await Session.findByIdAndDelete(id);

    if (!deletedSession) {
      throw new NotFoundError("Session not found");
    }

    return {
      statusCode: 200,
      message: "Session deleted successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createSession,
  getSession,
  getSessionType,
  deleteApplication,
};

async function sendNotification(token, title, body, userId) {
  const payload = {
    to: token,
    priority: "high",
    notification: {
      title: title,
      body: body,
    },
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${process.env.FIREBASE_SECRET}`, // Replace with your FCM Server Key
    },
  };

  axios
    .post(`${process.env.FIREBASE_NOTIFICATION_URL}`, payload, config)
    .then(async (response) => {
      const addNotification = new Notification({
        title: title,
        body: body,
        userId: userId,
        multicastId: response.multicastId,
      });

      await addNotification.save();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
