const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Signup & Login Pages
router.get("/signup", (req, res) => res.render("signup"));
router.get("/login", (req, res) => res.render("login"));

// Signup Handler
router.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect(newUser.role === "employer" ? "/post-job" : "/jobs");
  } catch (err) {
    res.status(500).send("Error saving user: " + err.message);
  }
});

// Login Handler
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      // Render login again with error message
      return res.render("login");
    }

    req.session.user = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    res.redirect(user.role === "employer" ? "/post-job" : "/jobs");
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Logout Handler
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
});

module.exports = router;
