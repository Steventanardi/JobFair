<div align="center">

  <img src="https://raw.githubusercontent.com/Steventanardi/JobFair/main/public/nqu-logo.png" width="120" alt="National Quemoy University Logo">

  <h1>NQU Career Fair System</h1>

  <p><b>A Minimalist, Dual-Language Employer Registration &amp; Administration Platform</b></p>

  <p>
    <a href="https://nqu-job-fair.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
    </a>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </p>

</div>

---

## ✦ Overview

The **NQU Career Fair System** is a lightweight, responsive, full-stack web application built for **National Quemoy University (NQU)**. It streamlines the entire career fair lifecycle — from employer registration and application tracking to administrator review and site-wide announcements.

Built with performance and long-term usability in mind, the platform features a decoupled internationalization (i18n) system for seamless switching between **English** and **Traditional Chinese (繁體中文)**, and a premium **glassmorphism** UI aesthetic.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🏢 **Employer Registration** | Secure sign-up & login with `bcryptjs` session cookies |
| 📋 **Application Tracking** | Real-time status: `Pending`, `Approved`, or `Rejected` |
| 🌐 **Bilingual UI (i18n)** | Full English / 繁體中文 toggle — no page reload required |
| 📢 **Announcements** | Admins can post site-wide announcements visible to employers |
| 🛡️ **Admin Dashboard** | Centralized review table, booth assignment, and status management |
| ⚙️ **Dynamic Settings** | Update event dates, venues & deadlines — no code changes needed |
| 🔑 **Password Resets** | Admins can securely reset any employer's password |
| 🖼️ **Logo Uploads** | Employers upload high-res logos; admins can download them for poster production |
| 📊 **Analytics** | Submission counts, approval rates, and audit activity log |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla JavaScript, Vanilla CSS (CSS Variables) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (`pg` driver with connection pooling) |
| **Auth** | `express-session`, `bcryptjs`, rate-limiting middleware |
| **File Uploads** | `multer` (multipart/form-data) |
| **Deployment** | Vercel (Serverless) |

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A PostgreSQL database (e.g., [Neon](https://neon.tech) for free serverless Postgres)

### 2. Clone & Install

```bash
git clone https://github.com/Steventanardi/JobFair.git
cd JobFair
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL Connection (Neon or any Postgres provider)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Session Security — use a long, random string in production
SESSION_SECRET="your_very_secure_random_string_here"
```

### 4. Run the Application

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The app will be available at **`http://localhost:3000`**.

> The database schema is automatically initialized on first run. Default settings and the admin account are seeded automatically.

### 🔑 Default Admin Credentials

| Field | Value |
|---|---|
| **Admin URL** | `/admin/login` |
| **Username** | `admin` |
| **Password** | `nqu2025` |

> ⚠️ **Change the default password immediately after deployment.**

---

## 🗂 Project Structure

```text
JobFair/
├── db.js                 # PostgreSQL connection pool & schema migrations
├── server.js             # Express app entry point & middleware setup
├── vercel.json           # Vercel deployment configuration
├── public/               # Static assets served to the browser
│   ├── css/              # Glassmorphism design system & variables
│   ├── js/
│   │   ├── api.js        # Global fetch wrapper with error handling
│   │   ├── app.js        # Shared utilities (modals, toast notifications)
│   │   └── i18n.js       # EN / 繁體中文 translation strings
│   ├── admin/            # Admin login & dashboard views
│   ├── employer/         # Employer registration, login & dashboard
│   └── index.html        # Bilingual landing page
├── routes/               # Express API route handlers
│   ├── admin.js          # Dashboard stats, review, password resets
│   ├── auth.js           # Login / logout / session management
│   ├── announcements.js  # Site-wide announcements CRUD
│   ├── settings.js       # Dynamic event configuration
│   └── submissions.js    # Employer form data & logo uploads
├── middleware/           # Custom Express middleware (auth guards, rate limiting)
└── uploads/              # Employer logo storage (gitignored)
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. The `vercel.json` configuration routes all requests through `server.js`.

To deploy your own instance:

```bash
npm i -g vercel
vercel --prod
```

Set the `DATABASE_URL` and `SESSION_SECRET` as **Environment Variables** in your Vercel project dashboard.

---

<div align="center">
  <p><i>Design &amp; Engineering tailored for the future of NQU. · Built with ❤️ by <a href="https://github.com/Steventanardi">Steven Tanardi</a></i></p>
</div>
