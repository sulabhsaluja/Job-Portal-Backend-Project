const express = require("express");
const router = express.Router();
const Job = require("../models/job");

router.get("/applied-jobs", async (req, res) => {
  const jobs = await Job.find({ "applications.0": { $exists: true } }).populate(
    "applications.user"
  );

  const appliedJobs = [];
  jobs.forEach((job) => {
    job.applications.forEach((application) => {
      appliedJobs.push({
        title: job.title,
        company: job.company,
        location: job.location,
        applicantName: application.user?.username || "N/A",
        email: application.user?.email || "N/A",
        coverLetter: application.coverLetter || "No cover letter provided",
        status: application.status,
      });
    });
  });

  res.render("applied-jobs", { appliedJobs });
});

module.exports = router;
