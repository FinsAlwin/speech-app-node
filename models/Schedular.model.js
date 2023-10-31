const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchedularSchema = new Schema(
  {
    fromDatetime: {
      type: String,
      required: true,
    },
    toDatetime: {
      type: String,
      required: true,
    },
    therapistID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    sessionTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SessionType",
      required: true,
    },
  },
  { timestamps: true }
);

const Schedular = mongoose.model("Schedular", SchedularSchema);
module.exports = Schedular;
