const bcrypt = require("bcryptjs");
const Admin = require("../../../models/SuperUser.model");
const Subscription = require("../../../models/Subscription.model");
const Application = require("../../../models/Application.model");
const ApplicationCategory = require("../../../models/ApplicationCategory.model");
const ApplicationParams = require("../../../models/ApplicationParams.model");
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

//////////////////////////////Super Admin Auth//////////////////////////////////////////////

const register = async (params) => {
  const data = params.body;

  const passwordHashC = await bcrypt.hash(data.password, 10);

  const user = new Admin({
    username: data.username,
    password: passwordHashC,
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
  const user = await Admin.findOne({
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

  const token = generateJwtToken(user.id, user.passwordHash, user.username);

  const { id, username } = user;

  return {
    statusCode: 200,
    token,
    user: {
      id,
      username,
    },
  };
};

//////////////////////////////Subscription//////////////////////////////////////////////

const getSubscription = async () => {
  const subscriptionData = await Subscription.find();

  if (!subscriptionData) {
    throw new NotFoundError("Subscription data Empty");
  }

  return {
    statusCode: 200,
    data: subscriptionData,
    message: "Subscription data retrived successfully",
  };
};

const addSubscription = async ({ body }) => {
  const { subscriptionName } = body;

  try {
    const existingSubscription = await Subscription.findOne({
      subscriptionName: subscriptionName,
    });

    if (existingSubscription) {
      throw new Error("Game category already exists");
    }
    const newSubscription = new Subscription({
      subscriptionName,
    });
    await newSubscription.save();
    return {
      statusCode: 201,
      message: "Subscription registration completed successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const editSubscription = async ({ body }) => {
  const { id, subscriptionName } = body;
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(id, {
      subscriptionName: subscriptionName,
    });

    if (!updatedSubscription) {
      throw new NotFoundError("Subscription not found");
    }

    return {
      statusCode: 200,
      message: "Subscription successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const deleteSubscription = async ({ body }) => {
  const { id } = body;
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      throw new NotFoundError("Subscription not found");
    }

    return {
      statusCode: 200,
      message: "Subscription deleted successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

//////////////////////////////Application Category//////////////////////////////////////////////

const getApplicationCategory = async () => {
  const applicationCategoryData = await ApplicationCategory.find();

  if (!applicationCategoryData) {
    throw new NotFoundError("Application category data Empty");
  }

  return {
    statusCode: 200,
    data: applicationCategoryData,
    message: "Application category data retrived successfully",
  };
};

const addApplicationCategory = async ({ body }) => {
  const { categoryName } = body;

  try {
    const existingApplicationCategory = await ApplicationCategory.findOne({
      categoryName: categoryName,
    });

    if (existingApplicationCategory) {
      throw new Error("Application category already exists");
    }
    const newCategoryApplication = new ApplicationCategory({
      categoryName,
    });
    await newCategoryApplication.save();
    return {
      statusCode: 201,
      message: "Application category registration completed successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const editApplicationCategory = async ({ body }) => {
  const { id, categoryName } = body;
  try {
    const updatedApplicationCategory =
      await ApplicationCategory.findByIdAndUpdate(id, {
        categoryName: categoryName,
      });

    if (!updatedApplicationCategory) {
      throw new NotFoundError("Application category not found");
    }

    return {
      statusCode: 200,
      message: "Application category updated successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const deleteApplicationCategory = async ({ body }) => {
  const { id } = body;
  try {
    const deletedApplicationCategory =
      await ApplicationCategory.findByIdAndDelete(id);

    if (!deletedApplicationCategory) {
      throw new NotFoundError("Application category not found");
    }

    return {
      statusCode: 200,
      message: "Application category deleted successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

//////////////////////////////Application//////////////////////////////////////////////

const getApplication = async () => {
  const applicationData = await Application.find()
    .populate("subscriptionId")
    .populate("applicationCategoryId");

  if (!applicationData.length) {
    throw new NotFoundError("Application data Empty");
  }

  return {
    statusCode: 200,
    data: applicationData,
    message: "Application data retrieved successfully",
  };
};

const addApplication = async ({ body }) => {
  const {
    applicationName,
    applicationIframeURL,
    subscriptionId,
    isCameraRequired,
    isMicrophoneRequired,
    applicationCategoryId,
    isParams,
    params,
  } = body;

  try {
    const existingApplication = await Application.findOne({
      applicationName: applicationName,
      applicationIframeURL: applicationIframeURL,
    });

    if (existingApplication) {
      throw new Error("Application already exists");
    }

    const newApplication = new Application({
      applicationName: applicationName,
      applicationIframeURL: applicationIframeURL,
      subscriptionId: subscriptionId,
      isCameraRequired: isCameraRequired,
      isMicrophoneRequired: isMicrophoneRequired,
      applicationCategoryId: applicationCategoryId,
      isParams: isParams,
    });
    await newApplication.save();

    for (const param of params) {
      const applicationParams = new ApplicationParams({
        param: param,
        applicationId: newApplication.id,
      });
      await applicationParams.save();
    }

    return {
      statusCode: 201,
      message: "Application registration completed successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const editApplication = async ({ body }) => {
  const {
    id,
    applicationName,
    applicationIframeURL,
    subscriptionId,
    isCameraRequired,
    isMicrophoneRequired,
    applicationCategoryId,
    isGame,
    isParams,
  } = body;
  try {
    const updatedApplication = await Application.findByIdAndUpdate(id, {
      applicationName: applicationName,
      applicationIframeURL: applicationIframeURL,
      subscriptionId: subscriptionId,
      isCameraRequired: isCameraRequired,
      isMicrophoneRequired: isMicrophoneRequired,
      applicationCategoryId: applicationCategoryId,
      isGame: isGame,
      isParams: isParams,
    });

    if (!updatedApplication) {
      throw new NotFoundError("Application not found");
    }

    return {
      statusCode: 200,
      message: "Application updated successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const deleteApplication = async ({ body }) => {
  const { id } = body;
  try {
    // Delete all ApplicationParams with matching applicationId
    const deletedApplicationParams = await ApplicationParams.deleteMany({
      applicationId: id,
    });

    if (deletedApplicationParams.deletedCount === 0) {
      throw new NotFoundError("ApplicationParams not found");
    }

    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      throw new NotFoundError("Application not found");
    }

    return {
      statusCode: 200,
      message: "Application deleted successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

//////////////////////////////Application Params//////////////////////////////////////////////

const getApplicationParams = async () => {
  const applicationParamsData = await ApplicationParams.find();

  if (!applicationParamsData) {
    throw new NotFoundError("Application params data Empty");
  }

  return {
    statusCode: 200,
    data: applicationParamsData,
    message: "Application category data retrived successfully",
  };
};

const addApplicationParams = async ({ body }) => {
  const { param, applicationId } = body;

  try {
    const existingApplicationParams = await ApplicationParams.findOne({
      param: param,
      applicationId: applicationId,
    });

    if (existingApplicationParams) {
      throw new Error("Application param already exists");
    }
    const newApplicationParam = new ApplicationParams({
      param: param,
      applicationId: applicationId,
    });
    await newApplicationParam.save();
    return {
      statusCode: 201,
      message: "Application param registration completed successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const editApplicationParams = async ({ body }) => {
  const { id, param, applicationId } = body;
  try {
    const updatedApplicationParams = await ApplicationParams.findByIdAndUpdate(
      id,
      {
        param: param,
        applicationId: applicationId,
      }
    );

    if (!updatedApplicationParams) {
      throw new NotFoundError("Application params not found");
    }

    return {
      statusCode: 200,
      message: "Application params updated successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

const deleteApplicationParams = async ({ body }) => {
  const { id } = body;
  try {
    const deletedApplicationParams = await ApplicationParams.findByIdAndDelete(
      id
    );

    if (!deletedApplicationParams) {
      throw new NotFoundError("Application params not found");
    }

    return {
      statusCode: 200,
      message: "Application params deleted successfully",
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message || "An error occurred",
    };
  }
};

//////////////////////////////Users//////////////////////////////////////////////

const getUsers = async () => {
  try {
    const users = await User.find();

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

module.exports = {
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
};
