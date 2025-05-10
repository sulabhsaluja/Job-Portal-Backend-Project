// const express = require('express');
// const router = express.Router();
// const Job = require('../models/job');

// router.get('/jobs', async (req, res) => {
//   const jobs = await Job.find().sort({ postedAt: -1 });

//   // Map and format tech stack for each job
//   const processedJobs = jobs.map(job => ({
//     ...job.toObject(),
//     techStackString: job.technologyStack?.join(", ") || "N/A"
//   }));

//   res.render('jobs-list', { jobs: processedJobs });
// });

// router.get('/job/:jobId', async (req, res) => {
//   const job = await Job.findById(req.params.jobId);
//   if (!job) return res.status(404).send("Job not found.");
//   res.render("job-details", {
//     jobId: job._id,
//     title: job.title,
//     company: job.company,
//     location: job.location,
//     description: job.description,
//     salary: job.salary,
//     technologyStack: job.technologyStack.join(", "),
//   });
// });

// router.get('/apply/:jobId', (req, res) => {
//   if (!req.session.user) return res.redirect("/login");
//   res.render("job-application", { jobId: req.params.jobId });
// });

// router.post("/submit-application", async (req, res) => {
//   try {
//     const { jobId, coverLetter } = req.body;

//     if (!req.session.user) return res.redirect("/login");

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).send("Job not found.");

//     job.applications.push({
//       user: req.session.user.id,  // User ID
//       coverLetter: coverLetter,   // ✅ Save cover letter
//       status: "pending",
//       appliedAt: new Date(),
//     });

//     await job.save();
//     res.redirect("/");
//   } catch (err) {
//     res.status(500).send("Error submitting application: " + err.message);
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Job = require('../models/job');

// router.get('/jobs', async (req, res) => {
//   try {
//     const { search, location, tech } = req.query;

//     const filter = {};

//     if (search) {
//       filter.title = { $regex: new RegExp(search, 'i') }; // case-insensitive
//     }

//     if (location) {
//       filter.location = { $regex: new RegExp(location, 'i') };
//     }

//     if (tech) {
//       filter.technologyStack = { $in: [new RegExp(tech, 'i')] }; // partial match
//     }

//     const jobs = await Job.find(filter).sort({ postedAt: -1 });

//     const processedJobs = jobs.map(job => ({
//       ...job.toObject(),
//       techStackString: job.technologyStack?.join(", ") || "N/A"
//     }));

//     res.render('jobs-list', {
//       jobs: processedJobs,
//       search,
//       location,
//       tech
//     });
//   } catch (error) {
//     console.error('Error loading jobs:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// router.get('/job/:jobId', async (req, res) => {
//   const job = await Job.findById(req.params.jobId);
//   if (!job) return res.status(404).send("Job not found.");

//   res.render("job-details", {
//     jobId: job._id,
//     title: job.title,
//     company: job.company,
//     location: job.location,
//     description: job.description,
//     salary: job.salary,
//     technologyStack: job.technologyStack.join(", "),
//   });
// });

// router.get('/apply/:jobId', (req, res) => {
//   if (!req.session.user) return res.redirect("/login");
//   res.render("job-application", { jobId: req.params.jobId });
// });

// router.post("/submit-application", async (req, res) => {
//   try {
//     const { jobId, coverLetter } = req.body;

//     if (!req.session.user) return res.redirect("/login");

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).send("Job not found.");

//     job.applications.push({
//       user: req.session.user.id,
//       coverLetter: coverLetter,
//       status: "pending",
//       appliedAt: new Date(),
//     });

//     await job.save();
//     res.redirect("/");
//   } catch (err) {
//     res.status(500).send("Error submitting application: " + err.message);
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Job = require("../models/job");

router.get("/jobs", async (req, res) => {
  try {
    const { search, location, tech, company, sort } = req.query;

    const filter = {};

    // Filter by job title (search)
    if (search) {
      filter.title = { $regex: new RegExp(search, "i") };
    }

    // Filter by location
    if (location) {
      filter.location = { $regex: new RegExp(location, "i") };
    }

    // Filter by company
    if (company) {
      filter.company = { $regex: new RegExp(company, "i") };
    }

    // Filter by technology stack
    if (tech) {
      filter.technologyStack = { $in: [new RegExp(tech, "i")] };
    }

    // Sorting logic
    let sortOption = { postedAt: -1 }; // default
    if (sort === "salary_asc") {
      sortOption = { salary: 1 };
    } else if (sort === "salary_desc") {
      sortOption = { salary: -1 };
    }

    const jobs = await Job.find(filter).sort(sortOption);

    const processedJobs = jobs.map((job) => ({
      ...job.toObject(),
      techStackString: job.technologyStack?.join(", ") || "N/A",
    }));

    res.render("jobs-list", {
      jobs: processedJobs,
      search,
      location,
      company,
      tech,
      sort,
    });
  } catch (error) {
    console.error("Error loading jobs:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/job/:jobId", async (req, res) => {
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

router.get("/apply/:jobId", (req, res) => {
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
      user: req.session.user.id,
      coverLetter: coverLetter,
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
