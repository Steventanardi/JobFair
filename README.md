<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/zh/thumb/0/05/National_Quemoy_University_logo.svg/1200px-National_Quemoy_University_logo.svg.png" width="120" alt="NQU Logo">
  <h1>NQU Career Fair System</h1>
  <p><b>A Minimalist, Dual-Language Employer Registration & Administration Platform</b></p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  </p>
</div>

---

## ✦ Overview
The **NQU Career Fair System** is a lightweight, responsive, and luxurious full-stack web application designed for National Quemoy University (NQU). It streamlines the process for employers to register for the annual career fair and provides university administrators with a comprehensive dashboard to manage data, verify submissions, make site-wide announcements, and extract data.

Built with performance and long-term usability in mind, the platform uses a decoupled internationalization (i18n) system to switch effortlessly between English and Traditional Chinese (繁體中文).

## ✨ Key Features

### 🏢 For Employers
* **Painless Registration and Authentication:** Secure signup and login using `bcrypt` and session cookies.
* **Streamlined Form Submissions:** Employers can seamlessly input their company details, contact info, job requirements, benefits, and upload high-resolution logos.
* **Application Status Tracking:** Employers can monitor whether their booth request is currently *Pending*, *Approved*, or *Rejected*.
* **Responsive Design:** A premium, "glassmorphism" aesthetic built completely with Vanilla CSS, responsive on mobile and desktop.

### 🛡️ For Administrators
* **Centralized Data Table:** A comprehensive view of all submissions directly in the dashboard.
* **Submission Review System:** Quickly mark applications as `Approved` or `Rejected` while keeping optional, internal Admin Notes.
* **Booth Assignments:** Allocate specific booth numbers directly to verified employers (paving the way for a future interactive visual map).
* **Dynamic Site Configuration:** Update event dates, deadlines, and venues directly from the Admin Dashboard using the **Settings tab**, so no code changes are required for future career fairs.
* **Account Management:** Instantly securely reset a forgotten employer's password.
* **Asset Extraction:** Quick 1-click Download buttons (⬇ DL) to retrieve uploaded, full-resolution employer logos for generating official marketing posters.

---

## 🛠 Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript, Vanilla CSS (with CSS Variables for easy theming).
* **Backend:** Node.js, Express.js.
* **Database:** SQLite (`better-sqlite3` for high-performance synchronous queries).
* **Authentication:** Express Sessions, `bcryptjs`.
* **File Uploads:** `multer` handling multipart/form-data.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone the repository and install the initial dependencies:

```bash
git clone https://github.com/yourusername/nqu-jobfair.git
cd nqu-jobfair
npm install
```

### 3. Environment variables (Optional but Recommended)
For production, you should run this with a custom session secret. Create a `.env` file or export the variable into your environment:
```bash
SESSION_SECRET="your_very_secure_random_string_here"
```

### 4. Running the application
Start the server. The SQLite Database (`jobfair.db`) will automatically initialize if it does not exist, and default settings will be seeded.

```bash
npm start
```
*The app will run at `http://localhost:3000`*

### 🔑 Default Credentials
Upon the first run, a default administrator account is generated. **Change the password immediately upon deployment.**
* **Admin Link:** `http://localhost:3000/admin/login`
* **Username:** `admin`
* **Password:** `nqu2025`

---

## 🗂 Directory Structure
```text
├── db.js                 # SQLite connection and migration logic
├── server.js             # Express application and middlewares
├── public/               # Static assets (HTML, CSS, Frontend JS)
│   ├── css/              # Minimalist luxury styles
│   ├── js/
│   │   ├── api.js        # Global API fetch wrapper
│   │   ├── app.js        # Global utilities (modals, toasts)
│   │   └── i18n.js       # Internationalization mappings
│   ├── admin/            # Admin login and dashboard views
│   ├── employer/         # Employer login/register and dashboard views
│   └── index.html        # Bilingual Landing Page
├── routes/               # Express API endpoints
│   ├── admin.js          # Password resets, stats, review logic
│   ├── auth.js           # Login, Session Management
│   ├── settings.js       # Dynamic Event Settings (Dates, Venues)
│   └── submissions.js    # Employer registration data handling
└── uploads/              # Storage directory for employer logos (.gitignore protected)
```

---

<div align="center">
  <p><i>Design & Engineering tailored for the future of NQU.</i></p>
</div>
