const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema(
  {
    applicationName: {
      type: String,
      required: true,
    },
    applicationIframeURL: {
      type: String,
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    isCameraRequired: {
      type: Boolean,
      default: false,
    },
    isMicrophoneRequired: {
      type: Boolean,
      default: false,
    },
    applicationCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApplicationCategory",
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
