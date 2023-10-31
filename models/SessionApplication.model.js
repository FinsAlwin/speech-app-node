const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionApplicationSchema = new Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sessions",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: false,
    },
  },
  { timestamps: true }
);

const SessionApplication = mongoose.model(
  "SessionApplication",
  SessionApplicationSchema
);
module.exports = SessionApplication;
