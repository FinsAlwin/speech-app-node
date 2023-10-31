const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationParamsSchema = new Schema(
  {
    param: {
      type: String,
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

const ApplicationParams = mongoose.model(
  "ApplicationParams",
  ApplicationParamsSchema
);
module.exports = ApplicationParams;
