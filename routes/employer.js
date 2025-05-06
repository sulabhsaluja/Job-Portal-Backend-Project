const express = require('express');
const router = express.Router();
const Job = require('../models/job');

// GET: Post Job Page
router.get('/post-job', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('post-job', { user: req.session.user });
});

// POST: Create New Job
router.post('/post-job', async (req, res) => {
  const { title, company, location, description, requirements, salary, technologyStack } = req.body;

  const newJob = new Job({
    title,
    company,
    location,
    description,
    requirements,
    salary,
    technologyStack: technologyStack.split(",").map(t => t.trim()),
    user: req.session.user.id
  });

  await newJob.save();
  res.redirect('/');
});

// GET: Manage Applications Page (only pending)
router.get('/manage-applications', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'employer') {
    return res.redirect('/');
  }

  try {
    const jobs = await Job.find({ user: req.session.user.id })
      .populate('applications.user') // Get applicant details
      .lean();

    const jobsWithPendingApplications = jobs.map(job => {
      job.applications = job.applications.filter(app => app.status === 'pending');
      return job;
    }).filter(job => job.applications.length > 0);

    res.render('manage-applications', {
      jobs: jobsWithPendingApplications,
      user: req.session.user
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).send("Server error");
  }
});

// POST: Update Application Status
router.post('/update-application-status', async (req, res) => {
  const { jobId, applicantId, status } = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const application = job.applications.find(app => app.user.toString() === applicantId);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    application.status = status;
    await job.save();

    if (req.headers['content-type']?.includes('application/json')) {
      return res.json({ success: true, message: "Status updated." });
    }

    res.redirect('/manage-applications');
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
