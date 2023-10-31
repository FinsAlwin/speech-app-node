const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema(
  {
    sessionName: {
      type: String,
      unique: true,
      required: true,
    },
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
  },
  { timestamps: true }
);

const Sessions = mongoose.model("Sessions", SessionSchema);
module.exports = Sessions;
