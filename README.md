# 🧑‍💼 InternSpot - Job Portal Backend Project

This is a backend-focused job portal web application built with **Node.js**, **Express**, **MongoDB**, and **Handlebars**. It allows employers to post jobs and manage applications, while job seekers can browse jobs and apply seamlessly.

---

## 📁 Project Structure

```

Demo Project/
├── models/               # Mongoose models (User, Job, Application)
├── routes/               # Express routes (auth, jobs, applications)
├── views/                # Handlebars templates for frontend rendering
├── public/               # Static files (CSS, JS)
├── server.js             # Main entry point
├── package.json          # Project metadata and dependencies
└── node\_modules/         # Installed npm packages

````

---

## ⚙️ Features

- User authentication with session-based login
- Role-based access (Employer vs Job Seeker)
- Employers can:
  - Post new jobs
  - View and manage applications
- Job Seekers can:
  - Browse available jobs
  - Apply with full name, email, and cover letter
- Responsive frontend with dynamic templates (Handlebars)
- MongoDB for data persistence

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+ installed
- MongoDB running locally or via cloud (MongoDB Atlas)

### Installation

## 🚀 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/sulabhsaluja/Job-Portal-Backend-Project.git
cd Job-Portal-Backend-Project
npm install


### Running the App

node server.js
```

Visit `http://localhost:3000` in your browser.

---

## 🧩 Dependencies

* express
* express-session
* mongoose
* hbs
* ejs (for partial view rendering)
* three, vanta (for visual enhancements)

---

## 📌 Notes

* Default port is **3000**
* Views are rendered using `.hbs` templates
* Passwords are not hashed – for demo purposes only (security improvements recommended)

---
