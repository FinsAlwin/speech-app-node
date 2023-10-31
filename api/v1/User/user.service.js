const bcrypt = require("bcryptjs");
const User = require("../../../models/Users.model");
const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../utils/api_error_util");
require("dotenv").config();

const generateJwtToken = (id, password, username) => {
  return jwt.sign(
    {
      id,
      password,
      username,
    },
    process.env.SAFE_WORD,
    { expiresIn: "7d" }
  );
};

//////////////////////////////User Auth//////////////////////////////////////////////

const register = async (params) => {
  const data = params.body;

  const passwordHashC = await bcrypt.hash(data.password, 10);

  const user = new User({
    username: data.username,
    password: passwordHashC,
    isPatient: data.isPatient,
    firstname: data.firstname,
    lastname: data.lastname,
    age: data.age,
    email: data.email,
    phone: data.phone,
    isSelfRegistration: data.isSelfRegistration,
    subscriptionId: data.subscriptionId,
  });

  try {
    await user.save(); // No need for Promise.all() here

    return {
      statusCode: 201,
      message: "Registration completed successfully",
    };
  } catch (error) {
    return { statusCode: 400, message: error.message };
  }
};

const signin = async ({ body }) => {
  const user = await User.findOne({
    username: body.username,
  });

  if (!user) {
    throw new BadRequestError(
      "User with this Username could not be found....."
    );
  }

  const isEqual = await bcrypt.compare(body.password, user.password);

  if (!isEqual) {
    throw new BadRequestError("Wrong password!");
  }

  user.save();

  const updatedUser = await User.findByIdAndUpdate(user.id, {
    fcmToken: body.fcmToken,
  });

  const token = generateJwtToken(user.id, user.passwordHash, user.username);

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
  } = updatedUser;

  return {
    statusCode: 200,
    token,
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
  };
};

const editUserProfile = async ({ body }) => {
  try {
    const updatedUserProfile = await User.findByIdAndUpdate(body.id, {
      firstname: body.firstname,
      lastname: body.lastname,
      age: body.age,
      profilePicUrl: body.profilePicUrl,
    });

    if (!updatedUserProfile) {
      throw new NotFoundError("User not found");
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
    } = updatedUserProfile;

    return {
      statusCode: 200,
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
      },
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const setFcmToken = async ({ body }) => {
  try {
    const updatedUserProfile = await User.findByIdAndUpdate(body.id, {
      fcmToken: body.fcmToken,
    });

    if (!updatedUserProfile) {
      throw new NotFoundError("User not found");
    }

    return {
      statusCode: 200,
      message: "Fcm token updated successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const getUserDetails = async ({ body, headers }) => {
  try {
    if (headers.authorization) {
      const token = headers.authorization.split(" ")[1];
      const userAuth = jwt.verify(token, process.env.SAFE_WORD);

      const user = await User.findOne({
        username: userAuth.username,
      });

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

      return {
        statusCode: 200,
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

module.exports = {
  register,
  signin,
  editUserProfile,
  setFcmToken,
  getUserDetails,
};
