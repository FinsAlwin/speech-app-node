const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuperUserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SuperUser = mongoose.model("SuperUser", SuperUserSchema);
module.exports = SuperUser;
