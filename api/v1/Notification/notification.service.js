const bcrypt = require("bcryptjs");
const Notification = require("../../../models/Notification.model");
const User = require("../../../models/Users.model");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../utils/api_error_util");
require("dotenv").config();

const getNotification = async ({ headers }) => {
  try {
    if (headers.authorization) {
      const token = headers.authorization.split(" ")[1];
      const userAuth = jwt.verify(token, process.env.SAFE_WORD);

      const user = await User.findOne({
        username: userAuth.username,
      });

      const { id } = user;

      const notification = await Notification.find({
        userId: id,
      });

      return {
        statusCode: 200,
        notification,
        message: "User Details retrived successfully",
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const addNotification = async ({ body }) => {
  try {
    const user = await User.findOne({
      _id: body.userId,
    });

    if (!user) {
      throw new BadRequestError("User not found.....");
    }

    await sendNotification(
      user.fcmToken,
      body.title,
      body.description,
      body.userId
    );

    return {
      statusCode: 200,
      message: "Notification send successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

module.exports = {
  getNotification,
  addNotification,
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
    .post("https://fcm.googleapis.com/fcm/send", payload, config)
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
