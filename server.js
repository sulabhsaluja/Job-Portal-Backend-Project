const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Make user globally available in templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Handlebars helpers
hbs.registerHelper("eq", (a, b) => a === b);

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/job_portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Views & Static
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // <- important if not already present
hbs.registerPartials(path.join(__dirname, "views/partials")); // <- this line enables partials
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => res.render("home"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/jobs"));
app.use("/", require("./routes/employer"));
app.use("/", require("./routes/user"));

// Server start
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
