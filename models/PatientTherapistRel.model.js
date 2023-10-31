const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientTherapistRelSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const PatientTherapistRel = mongoose.model(
  "PatientTherapistRel",
  PatientTherapistRelSchema
);
module.exports = PatientTherapistRel;
