const User = require("../../../models/Users.model");
const Session = require("../../../models/Session.model");
const Notification = require("../../../models/Notification.model");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../utils/api_error_util");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const getSession = async ({ headers }) => {
  try {
    if (headers.authorization) {
      const token = headers.authorization.split(" ")[1];
      const userAuth = jwt.verify(token, process.env.SAFE_WORD);

      const user = await User.findOne({
        username: userAuth.username,
      });

      const sessions = await Session.find({
        userId: user.id,
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
