const express = require("express");
const router = express.Router();
const Job = require("../models/job");

// router.get("/applied-jobs", async (req, res) => {
//   if (!req.session.user) return res.redirect("/login");

//   const userId = req.session.user.id;

//   const jobs = await Job.find({ "applications.user": userId }).populate(
//     "applications.user"
//   );

//   const appliedJobs = [];
//   jobs.forEach((job) => {
//     job.applications.forEach((application) => {
//       if (String(application.user._id) === String(userId)) {
//         appliedJobs.push({
//           title: job.title,
//           company: job.company,
//           location: job.location,
//           applicantName: application.user?.username || "N/A",
//           email: application.user?.email || "N/A",
//           coverLetter: application.coverLetter || "No cover letter provided",
//           status: application.status,
//         });
//       }
//     });
//   });

//   res.render("applied-jobs", { appliedJobs });
// });







router.get("/applied-jobs", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login"); // Block if not logged in
  }

  try {
    const userId = req.session.user.id;
    const jobs = await Job.find({ "applications.user": userId }).lean();

    const appliedJobs = jobs.flatMap((job) =>
      job.applications
        .filter((app) => app.user.toString() === userId)
        .map((app) => ({
          title: job.title,
          company: job.company,
          location: job.location,
          coverLetter: app.coverLetter,
          status: app.status,
        }))
    );

    res.render("applied-jobs", { appliedJobs, user: req.session.user });
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
