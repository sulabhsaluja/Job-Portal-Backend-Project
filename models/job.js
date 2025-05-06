
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
  },
  salary: {
    type: String,
  },
  technologyStack: {
    type: [String],
    required: true,
    default: [],
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applications: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      coverLetter: { type: String }, // ✅ Added field to store applicant’s cover letter
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
