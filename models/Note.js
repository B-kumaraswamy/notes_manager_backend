const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is mandatory
    },
    description: {
      type: String,
      required: true, // Description is mandatory
    },
    category: {
      type: String,
      enum: ["Work", "Personal", "Others"], // Enum constraint for category
      default: "Others",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);