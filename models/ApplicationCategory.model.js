const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationCategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    // Add any other category-related fields here
  },
  { timestamps: true }
);

const ApplicationCategory = mongoose.model(
  "ApplicationCategory",
  ApplicationCategorySchema
);
module.exports = ApplicationCategory;
