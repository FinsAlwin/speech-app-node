const Admin = require("../../../models/admin.model");

const {
  NotFoundError,
  BadRequestError,
} = require("../../../utils/api_error_util");

const validateUsername = async (username) => {
  const user = await Admin.find({
    username: username,
  });

  if (user) {
    if (user.username === username) {
      throw new BadRequestError({ message: "Username already exists!" });
    }
  }

  return;
};

module.exports = {
  validateUsername,
};
