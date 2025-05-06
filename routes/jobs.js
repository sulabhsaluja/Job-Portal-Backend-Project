const express = require('express');
const router = express.Router();
const Job = require('../models/job');

router.get('/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ postedAt: -1 });

  // Map and format tech stack for each job
  const processedJobs = jobs.map(job => ({
    ...job.toObject(),
    techStackString: job.technologyStack?.join(", ") || "N/A"
  }));

  res.render('jobs-list', { jobs: processedJobs });
});


router.get('/job/:jobId', async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).send("Job not found.");
  res.render("job-details", {
    jobId: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    salary: job.salary,
    technologyStack: job.technologyStack.join(", "),
  });
});

router.get('/apply/:jobId', (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("job-application", { jobId: req.params.jobId });
});

router.post("/submit-application", async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!req.session.user) return res.redirect("/login");

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).send("Job not found.");

    job.applications.push({
      user: req.session.user.id,  // User ID
      coverLetter: coverLetter,   // ✅ Save cover letter
      status: "pending",
      appliedAt: new Date(),
    });

    await job.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error submitting application: " + err.message);
  }
});

module.exports = router;