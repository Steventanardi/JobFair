<div align="center">

  <img src="https://raw.githubusercontent.com/Steventanardi/JobFair/main/public/nqu-logo.png" width="120" alt="National Quemoy University Logo">

  <h1>NQU Career Fair System</h1>

  <p><b>A Bilingual Employer Registration &amp; Administration Platform for National Quemoy University</b></p>

  <p>
    <a href="https://nqu-job-fair.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
    </a>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  </p>

</div>

---

## Overview

The **NQU Career Fair System** is a full-stack web application built for **National Quemoy University (NQU)**. It manages the entire career fair lifecycle — from employer registration and booth assignment to admin review, announcements, and content management.

The platform features a built-in internationalization (i18n) system for seamless switching between **English** and **Traditional Chinese (繁體中文)**, with no page reload required.

---

## Features

| Feature | Details |
|---|---|
| 🏢 **Employer Portal** | Registration, login, submission form, status tracking, and dashboard |
| 📋 **Submission Lifecycle** | Real-time status: `Pending → Approved / Rejected` with progress timeline |
| 🎪 **Booth Assignment** | Admins assign booth numbers; employers see them prominently on their dashboard |
| 🌐 **Bilingual UI** | Full English / 繁體中文 toggle — client-side, no reload |
| 📢 **Announcements** | Admins post pinned or normal site-wide announcements |
| 🛡️ **Admin Dashboard** | Submission review, bulk approve/reject, booth management, employer accounts |
| 📊 **Export** | Download submissions as CSV, Excel, or print-to-PDF |
| 📝 **CMS** | Manage pages, navigation, media library, and site-wide settings |
| ⚙️ **Site Settings** | Event date, venue, deadlines, contact info, social links — no code changes needed |
| 🔑 **Password Management** | Admins reset employer passwords; employers change their own |
| 🖼️ **Logo Uploads** | Employers upload company logos stored as base64 in the database |
| 🔒 **Security** | Session fixation prevention, CSRF protection, bcrypt hashing, rate limiting |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla JavaScript, Vanilla CSS (CSS Variables) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (`pg` driver with connection pooling) |
| **Auth** | `express-session` + `connect-pg-simple`, `bcryptjs` |
| **File Uploads** | `multer` (memory storage, base64 to DB) |
| **Security** | `helmet`, `compression`, `express-rate-limit` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A PostgreSQL database (e.g., [Neon](https://neon.tech) for free serverless Postgres)

### Clone & Install

```bash
git clone https://github.com/Steventanardi/JobFair.git
cd JobFair
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Session secret — use a long random string in production
SESSION_SECRET="your_very_secure_random_string_here"
```

### Run Locally

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The app runs at **`http://localhost:3000`**. The database schema and default data are initialized automatically on first run.

### Default Admin Credentials

| Field | Value |
|---|---|
| **URL** | `/admin/login` |
| **Username** | `admin` |
| **Password** | `nqu2025` |

> **Change the default password immediately after deployment.**

---

## Project Structure

```
JobFair/
├── server.js             # Express app entry point, middleware, route mounting
├── db.js                 # PostgreSQL pool, schema creation, seed data
├── package.json
├── public/               # Static files served to the browser
│   ├── css/style.css     # Design system with CSS variables
│   ├── js/
│   │   ├── api.js        # Fetch wrapper with session handling
│   │   ├── app.js        # Shared UI utilities (modals, toasts, nav)
│   │   └── i18n.js       # EN / 繁體中文 translation strings
│   ├── admin/
│   │   ├── login.html    # Admin login
│   │   ├── dashboard.html # Submissions, employers, analytics, settings
│   │   └── cms.html      # Content management (pages, media, navigation)
│   ├── employer/
│   │   ├── login.html    # Employer login
│   │   ├── register.html # Employer registration
│   │   ├── dashboard.html # Submission status, account settings
│   │   └── submit.html   # Registration form (3 category types)
│   └── index.html        # Public landing page
├── routes/
│   ├── auth.js           # Login, register, logout, password change
│   ├── submissions.js    # Employer submission CRUD
│   ├── admin.js          # Admin review, employer management, exports, logs
│   ├── announcements.js  # Site-wide announcements
│   ├── settings.js       # Registration status & deadline
│   └── cms.js            # Pages, media, navigation, CMS settings
├── middleware/
│   └── auth.js           # requireEmployer / requireAdmin session guards
└── uploads/              # File uploads (gitignored, kept via .gitkeep)
```

---

## Deployment

This project is designed for deployment on **Vercel** (serverless Node.js).

### 1. Create `vercel.json` in the project root

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "server.js" },
    { "src": "/employer/(.*)", "dest": "server.js" },
    { "src": "/admin/(.*)", "dest": "server.js" },
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

### 2. Deploy

```bash
npm i -g vercel
vercel --prod
```

### 3. Set Environment Variables in Vercel

Add `DATABASE_URL` and `SESSION_SECRET` in your Vercel project **Settings → Environment Variables**.

---

<div align="center">
  <p><i>Built for NQU Career Development Center · by <a href="https://github.com/Steventanardi">Steven Tanardi</a></i></p>
</div>
