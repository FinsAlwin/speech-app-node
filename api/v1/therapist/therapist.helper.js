const User = require("../../../models/Users.model");

const {
  NotFoundError,
  BadRequestError,
} = require("../../../utils/api_error_util");

const validateUsername = async (req, res, next) => {
  const user = await User.find({
    username: req.body.username,
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
