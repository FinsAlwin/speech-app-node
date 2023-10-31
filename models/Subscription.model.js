const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
  {
    subscriptionName: {
      type: String,
      required: true,
    },
    isPatient: {
      type: Boolean,
      default: true,
      required: true,
    },
    // Add any other subscription-related fields here
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;
